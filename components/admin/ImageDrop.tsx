"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

/** Single or multi image picker with previews, for admin forms. */
export function ImageDrop({
  name,
  multiple = false,
  current,
  label = "Drop an image or click to browse",
}: {
  name: string;
  multiple?: boolean;
  current?: string | null;
  label?: string;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const next = files.map((f) => URL.createObjectURL(f));
    setUrls(next);
    return () => next.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  useEffect(() => {
    if (!inputRef.current) return;
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    inputRef.current.files = dt.files;
  }, [files]);

  const addFiles = (list: FileList | File[]) => {
    const incoming = Array.from(list).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => (multiple ? [...prev, ...incoming].slice(0, 20) : incoming.slice(0, 1)));
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        multiple={multiple}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => e.target.files && addFiles(e.target.files)}
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
        className={`relative grid cursor-pointer place-items-center overflow-hidden rounded-3xl border-2 border-dashed px-6 py-8 text-center transition ${
          dragging ? "border-snorlax-500 bg-snorlax-50 dark:bg-snorlax-800" : "border-line hover:border-snorlax-300"
        }`}
      >
        {!multiple && (urls[0] || current) ? (
          <img src={urls[0] ?? current ?? ""} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
        ) : null}
        <div className={`relative ${!multiple && (urls[0] || current) ? "rounded-2xl bg-snorlax-950/60 px-4 py-3 text-cream-50 backdrop-blur" : ""}`}>
          <ImagePlus className="mx-auto" size={24} />
          <p className="mt-2 text-sm font-bold">{!multiple && (urls[0] || current) ? "Replace image" : label}</p>
          <p className={`mt-0.5 text-xs ${!multiple && (urls[0] || current) ? "text-cream-100/80" : "text-muted"}`}>JPG, PNG, WEBP · 8 MB each</p>
        </div>
      </div>
      {multiple && urls.length > 0 && (
        <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {urls.map((u, i) => (
            <li key={u} className="relative aspect-square overflow-hidden rounded-xl bg-cream-200 dark:bg-snorlax-800">
              <img src={u} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                aria-label="Remove"
                onClick={() => setFiles((f) => f.filter((_, j) => j !== i))}
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-snorlax-950/70 text-white hover:bg-berry-500"
              >
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
