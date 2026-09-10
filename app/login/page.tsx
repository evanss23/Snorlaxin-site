import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";
import { MascotMark } from "@/components/Mascot";
import { PageEnter } from "@/components/motion";

export const metadata: Metadata = { title: "Team login" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <PageEnter className="container-x flex min-h-[70vh] items-center justify-center py-12">
      <div className="card w-full max-w-md p-8 sm:p-10">
        <div className="flex items-center gap-3">
          <MascotMark className="h-12 w-12" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-snorlax-500 dark:text-snorlax-300">Team only</p>
            <h1 className="text-3xl font-bold">Welcome back</h1>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">
          Sign in to add products, upload gallery photos and review custom requests.
        </p>
        <div className="mt-8">
          <LoginForm next={next} />
        </div>
      </div>
    </PageEnter>
  );
}
