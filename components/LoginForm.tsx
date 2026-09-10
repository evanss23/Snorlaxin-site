"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { Loader2, LogIn } from "lucide-react";
import { loginAction, type ActionState } from "@/app/actions/auth";
import { ActionForm } from "./ActionForm";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(loginAction, {});

  return (
    <ActionForm action={action} className="space-y-5">
      {next && <input type="hidden" name="next" value={next} />}
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className="field" placeholder="you@snorlaxin.com" />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="field" placeholder="••••••••" />
      </div>
      {state.error && (
        <motion.p
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl bg-berry-400/15 px-4 py-3 text-sm font-bold text-berry-600"
        >
          {state.error}
        </motion.p>
      )}
      <button type="submit" disabled={pending} className="btn btn-primary w-full text-base">
        {pending ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />} Sign in
      </button>
    </ActionForm>
  );
}
