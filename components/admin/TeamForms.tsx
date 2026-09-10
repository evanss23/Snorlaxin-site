"use client";

import { useActionState, useEffect, useRef } from "react";
import { changePasswordAction, createUserAction } from "@/app/actions/users";
import type { ActionState } from "@/app/actions/auth";
import { SubmitButton } from "./SubmitButton";
import { FormMessage } from "./FormMessage";
import { ActionForm } from "../ActionForm";

export function CreateUserForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(createUserAction, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.success) ref.current?.reset();
  }, [state]);
  return (
    <ActionForm ref={ref} action={action} className="card space-y-4 p-6">
      <h2 className="text-2xl font-bold">Invite a teammate</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="new-name">
            Name
          </label>
          <input id="new-name" name="name" required className="field" />
        </div>
        <div>
          <label className="label" htmlFor="new-email">
            Email
          </label>
          <input id="new-email" name="email" type="email" required className="field" />
        </div>
        <div>
          <label className="label" htmlFor="new-password">
            Temporary password
          </label>
          <input id="new-password" name="password" type="text" required minLength={8} className="field" />
        </div>
        <div>
          <label className="label" htmlFor="new-role">
            Role
          </label>
          <select id="new-role" name="role" defaultValue="team" className="field">
            <option value="team">Team (products, gallery, requests, orders)</option>
            <option value="admin">Admin (everything, including team)</option>
          </select>
        </div>
      </div>
      <FormMessage error={state.error} success={state.success} />
      <SubmitButton pending={pending}>Create account</SubmitButton>
    </ActionForm>
  );
}

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(changePasswordAction, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.success) ref.current?.reset();
  }, [state]);
  return (
    <ActionForm ref={ref} action={action} className="card space-y-4 p-6">
      <h2 className="text-2xl font-bold">Change your password</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="current">
            Current
          </label>
          <input id="current" name="current" type="password" required className="field" autoComplete="current-password" />
        </div>
        <div>
          <label className="label" htmlFor="password">
            New
          </label>
          <input id="password" name="password" type="password" required minLength={8} className="field" autoComplete="new-password" />
        </div>
        <div>
          <label className="label" htmlFor="confirm">
            Confirm
          </label>
          <input id="confirm" name="confirm" type="password" required className="field" autoComplete="new-password" />
        </div>
      </div>
      <FormMessage error={state.error} success={state.success} />
      <SubmitButton pending={pending}>Update password</SubmitButton>
    </ActionForm>
  );
}
