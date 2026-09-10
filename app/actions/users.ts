"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { hashPassword, requireAdmin, requireUser } from "@/lib/auth";
import type { ActionState } from "./auth";

const createSchema = z.object({
  name: z.string().trim().min(2, "Enter a name.").max(80),
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(8, "Passwords need at least 8 characters."),
  role: z.enum(["admin", "team"]),
});

export async function createUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = createSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  const d = parsed.data;
  const db = getDb();
  const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(d.email.toLowerCase());
  if (exists) return { error: "Someone on the team already uses that email." };
  db.prepare("INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)").run(
    d.email.toLowerCase(),
    d.name,
    await hashPassword(d.password),
    d.role,
  );
  revalidatePath("/admin/team");
  return { success: `${d.name} can now sign in.` };
}

export async function deleteUserAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = Number(formData.get("id"));
  if (id === admin.id) return;
  const db = getDb();
  const admins = db.prepare("SELECT COUNT(*) AS c FROM users WHERE role = 'admin'").get() as { c: number };
  const target = db.prepare("SELECT role FROM users WHERE id = ?").get(id) as { role: string } | undefined;
  if (!target) return;
  if (target.role === "admin" && admins.c <= 1) return;
  db.prepare("DELETE FROM users WHERE id = ?").run(id);
  revalidatePath("/admin/team");
}

const passwordSchema = z
  .object({
    current: z.string().min(1, "Enter your current password."),
    password: z.string().min(8, "New password needs at least 8 characters."),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "The new passwords don't match.", path: ["confirm"] });

export async function changePasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = passwordSchema.safeParse({
    current: formData.get("current"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  const { verifyCredentials } = await import("@/lib/auth");
  const ok = await verifyCredentials(user.email, parsed.data.current);
  if (!ok) return { error: "Your current password isn't right." };
  getDb().prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(await hashPassword(parsed.data.password), user.id);
  return { success: "Password updated." };
}
