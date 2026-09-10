"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export function SubmitButton({
  children,
  className = "btn btn-primary",
  pendingText,
  pending: pendingProp,
}: {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
  /** Pass the `pending` flag from useActionState when the form uses ActionForm. */
  pending?: boolean;
}) {
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" /> {pendingText ?? "Saving…"}
        </>
      ) : (
        children
      )}
    </button>
  );
}
