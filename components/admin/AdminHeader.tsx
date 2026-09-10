export function AdminHeader({ title, body, children }: { title: string; body?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {body && <p className="mt-1.5 text-muted">{body}</p>}
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
}
