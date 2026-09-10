"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession, verifyCredentials } from "@/lib/auth";

export interface ActionState {
  error?: string;
  success?: string;
}

const loginSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(1, "Enter your password."),
  next: z.string().optional(),
});

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your details." };

  const user = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!user) return { error: "That email and password don't match. Snorlax is still asleep." };

  await createSession(user);
  const next = parsed.data.next && parsed.data.next.startsWith("/") ? parsed.data.next : "/admin";
  redirect(next);
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
