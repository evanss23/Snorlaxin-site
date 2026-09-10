"use client";

import { startTransition, type ComponentPropsWithRef } from "react";

/**
 * A form bound to a `useActionState` dispatcher. Submitting dispatches the
 * action inside a transition, which (unlike `<form action={fn}>`) does not
 * reset the fields afterwards, so users keep what they typed when validation fails.
 */
export function ActionForm({
  action,
  ...props
}: Omit<ComponentPropsWithRef<"form">, "action"> & { action: (formData: FormData) => void }) {
  return (
    <form
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => action(formData));
      }}
    />
  );
}
