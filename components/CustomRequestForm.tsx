"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, ImagePlus, Loader2, PartyPopper, X } from "lucide-react";
import { submitRequestAction, type RequestState } from "@/app/actions/requests";
import { CUSTOM_SIZES, CUSTOM_TYPES, type CustomSize, type CustomType } from "@/lib/types";
import { ActionForm } from "./ActionForm";

const MAX_FILES = 6;

export function CustomRequestForm({ initialType }: { initialType?: string }) {
  const [state, action, pending] = useActionState<RequestState, FormData>(submitRequestAction, {});
  const [type, setType] = useState<CustomType>(
    CUSTOM_TYPES.some((t) => t.value === initialType) ? (initialType as CustomType) : "epoxy",
  );
  const [size, setSize] = useState<CustomSize>("medium");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const previews = useMemo(() => files.map((f) => ({ file: f, url: URL.createObjectURL(f) })), [files]);
  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

  const addFiles = (list: FileList | File[]) => {
    const incoming = Array.from(list).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...incoming].slice(0, MAX_FILES));
  };

  // Keep the hidden file input in sync with our managed file list so the
  // server action receives exactly the files the user sees.
  useEffect(() => {
    if (!inputRef.current) return;
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    inputRef.current.files = dt.files;
  }, [files]);

  if (state.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="card relative overflow-hidden p-10 text-center"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-snorlax-200/60 blur-3xl dark:bg-snorlax-600/30" />
        <motion.div
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-snorlax-500 text-cream-50 shadow-lift"
        >
          <PartyPopper size={34} />
        </motion.div>
        <h2 className="mt-6 text-3xl font-bold">Request received, {state.success.name.split(" ")[0]}!</h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Your request is <span className="font-bold">#{state.success.id}</span>. We&apos;ll look over your images and email you a
          quote and timeline, usually within two days.
        </p>
        <button type="button" onClick={() => window.location.reload()} className="btn btn-secondary mt-8">
          Send another request
        </button>
      </motion.div>
    );
  }

  return (
    <ActionForm action={action} className="card space-y-8 p-6 sm:p-10">
      {/* Type */}
      <div>
        <label className="label" htmlFor="product_type">
          What would you like us to make?
        </label>
        <div className="relative">
          <select
            id="product_type"
            name="product_type"
            value={type}
            onChange={(e) => setType(e.target.value as CustomType)}
            className="field appearance-none pr-12 text-lg font-bold"
          >
            {CUSTOM_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={type}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="mt-2 text-sm text-muted"
          >
            {CUSTOM_TYPES.find((t) => t.value === type)?.blurb}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Size */}
      <div>
        <span className="label">Size</span>
        <input type="hidden" name="size" value={size} />
        <div className="grid gap-3 sm:grid-cols-3">
          {CUSTOM_SIZES.map((s, i) => {
            const active = size === s.value;
            return (
              <motion.button
                key={s.value}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setSize(s.value)}
                className={`relative overflow-hidden rounded-3xl border p-4 text-left transition ${
                  active
                    ? "border-snorlax-500 bg-snorlax-50 shadow-glow dark:bg-snorlax-800"
                    : "border-line bg-surface hover:-translate-y-0.5 hover:border-snorlax-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-semibold">{s.label}</span>
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full border transition ${
                      active ? "border-snorlax-500 bg-snorlax-500 text-cream-50" : "border-line"
                    }`}
                  >
                    {active && <Check size={14} />}
                  </span>
                </div>
                <div className="mt-3 flex h-9 items-end gap-1" aria-hidden>
                  <span
                    className="rounded-md bg-snorlax-400/70 dark:bg-snorlax-300/70"
                    style={{ width: 14 + i * 10, height: 14 + i * 10 }}
                  />
                </div>
                <p className="mt-2 min-h-8 text-xs text-muted">{type === "epoxy" ? s.epoxy : s.rug}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Images */}
      <div>
        <span className="label">Reference images</span>
        <input
          ref={inputRef}
          type="file"
          name="images"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
          tabIndex={-1}
        />
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`grid cursor-pointer place-items-center rounded-3xl border-2 border-dashed px-6 py-10 text-center transition ${
            dragging ? "border-snorlax-500 bg-snorlax-50 dark:bg-snorlax-800" : "border-line hover:border-snorlax-300"
          }`}
        >
          <motion.span
            animate={dragging ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
            className="grid h-14 w-14 place-items-center rounded-2xl bg-snorlax-100 text-snorlax-600 dark:bg-snorlax-800 dark:text-snorlax-200"
          >
            <ImagePlus size={26} />
          </motion.span>
          <p className="mt-4 font-bold">Drop images here or click to browse</p>
          <p className="mt-1 text-sm text-muted">Up to {MAX_FILES} images · JPG, PNG, WEBP · 8 MB each</p>
        </div>

        <AnimatePresence>
          {previews.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6"
            >
              {previews.map((p, i) => (
                <motion.li
                  key={p.url}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-cream-200 dark:bg-snorlax-800"
                >
                  <img src={p.url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => setFiles((f) => f.filter((_, j) => j !== i))}
                    className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-snorlax-950/70 text-white transition hover:bg-berry-500"
                  >
                    <X size={14} />
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Contact */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">
            Your name
          </label>
          <input id="name" name="name" required className="field" placeholder="Ash Ketchum" />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" required className="field" placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="notes">
          Tell us about it <span className="normal-case tracking-normal opacity-70">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          className="field resize-y"
          placeholder="Colours, exact dimensions, where it'll live, deadlines, anything that helps."
        />
      </div>

      <AnimatePresence>
        {state.error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl bg-berry-400/15 px-4 py-3 text-sm font-bold text-berry-600"
          >
            {state.error}
          </motion.p>
        )}
      </AnimatePresence>

      <button type="submit" disabled={pending} className="btn btn-primary w-full text-base sm:w-auto">
        {pending ? (
          <>
            <Loader2 className="animate-spin" size={18} /> Sending…
          </>
        ) : (
          "Send my request"
        )}
      </button>
    </ActionForm>
  );
}
