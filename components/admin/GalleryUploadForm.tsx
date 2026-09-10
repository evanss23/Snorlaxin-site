"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { uploadGalleryAction } from "@/app/actions/gallery";
import type { ActionState } from "@/app/actions/auth";
import { ActionForm } from "../ActionForm";
import { ImageDrop } from "./ImageDrop";
import { SubmitButton } from "./SubmitButton";
import { FormMessage } from "./FormMessage";

export function GalleryUploadForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(uploadGalleryAction, {});
  const formRef = useRef<HTMLFormElement>(null);
  const [dropKey, setDropKey] = useState(0);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setDropKey((k) => k + 1);
    }
  }, [state]);

  return (
    <ActionForm ref={formRef} action={action} className="card space-y-5 p-6">
      <h2 className="text-2xl font-bold">Add photos</h2>
      <ImageDrop key={dropKey} name="images" multiple label="Drop photos here or click to browse" />
      <div>
        <label className="label" htmlFor="caption">
          Caption <span className="normal-case tracking-normal opacity-70">(optional, applies to all)</span>
        </label>
        <input id="caption" name="caption" className="field" placeholder="Fresh pour for the berry coaster set" />
      </div>
      <FormMessage error={state.error} success={state.success} />
      <SubmitButton pending={pending} pendingText="Uploading…">
        Upload to gallery
      </SubmitButton>
    </ActionForm>
  );
}
