import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getDb } from "./db";
import type { Role, User } from "./types";

export const SESSION_COOKIE = "snorlaxin_session";
const SESSION_DAYS = 14;

export function getSecret() {
  const secret = process.env.AUTH_SECRET ?? "snorlaxin-dev-secret-change-me";
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: Role;
}

export async function createSession(user: User) {
  const token = await new SignJWT({ email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      sub: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  const user = getDb()
    .prepare("SELECT id, email, name, role, created_at FROM users WHERE id = ?")
    .get(Number(session.sub)) as User | undefined;
  return user ?? null;
}

/** Any signed-in team member or admin. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  return user;
}

/** Full admins only (managing accounts). */
export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin?error=forbidden");
  return user;
}

export async function verifyCredentials(email: string, password: string): Promise<User | null> {
  const row = getDb()
    .prepare("SELECT id, email, name, role, created_at, password_hash FROM users WHERE email = ?")
    .get(email.trim().toLowerCase()) as (User & { password_hash: string }) | undefined;
  if (!row) return null;
  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) return null;
  const { password_hash: _ignored, ...user } = row;
  void _ignored;
  return user;
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
