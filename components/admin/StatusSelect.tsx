"use client";

import { useEffect, useState, useTransition } from "react";

/** Status dropdown that saves as soon as it changes. */
export function StatusSelect({
  action,
  id,
  value,
  options,
}: {
  action: (formData: FormData) => Promise<void>;
  id: number;
  value: string;
  options: readonly string[];
}) {
  const [pending, start] = useTransition();
  const [current, setCurrent] = useState(value);
  useEffect(() => setCurrent(value), [value]);

  return (
    <select
      name="status"
      aria-label="Status"
      value={current}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        setCurrent(next);
        const fd = new FormData();
        fd.set("id", String(id));
        fd.set("status", next);
        start(() => action(fd));
      }}
      className="field w-auto py-1.5 pr-8 text-sm font-bold capitalize"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o.replace("_", " ")}
        </option>
      ))}
    </select>
  );
}
