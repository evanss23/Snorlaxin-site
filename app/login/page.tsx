import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";
import { Mascot, MascotMark } from "@/components/Mascot";
import { PageEnter } from "@/components/motion";

export const metadata: Metadata = { title: "Team login" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <PageEnter className="container-x grid min-h-[70vh] items-center gap-10 py-12 lg:grid-cols-2">
      <div className="hidden lg:block">
        <Mascot variant="laptop" className="mx-auto max-w-lg" />
        <p className="mt-6 text-center font-display text-2xl font-semibold text-muted">Someone has to run the shop.</p>
      </div>
      <div className="card w-full max-w-md p-8 sm:p-10 lg:justify-self-center">
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
