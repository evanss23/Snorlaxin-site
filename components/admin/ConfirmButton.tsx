"use client";

import { useFormStatus } from "react-dom";

/** Submit button that asks for confirmation before firing its parent form. */
export function ConfirmButton({
  children,
  message = "Are you sure? This can't be undone.",
  className = "btn btn-danger btn-sm",
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
