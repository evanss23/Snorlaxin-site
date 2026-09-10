import Link from "next/link";
import { Mail, Trash2 } from "lucide-react";
import { deleteRequestAction, updateRequestStatusAction } from "@/app/actions/requests";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { formatDate } from "@/lib/format";
import { listRequests } from "@/lib/queries";
import { CUSTOM_SIZES, CUSTOM_TYPES, REQUEST_STATUSES } from "@/lib/types";

export default async function AdminRequests({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const requests = listRequests(status && (REQUEST_STATUSES as readonly string[]).includes(status) ? status : undefined);

  return (
    <>
      <AdminHeader title="Custom requests" body="Reference images, sizes and notes from people who want something made." />

      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
        <Filter href="/admin/requests" label="All" active={!status} />
        {REQUEST_STATUSES.map((s) => (
          <Filter key={s} href={`/admin/requests?status=${s}`} label={s.replace("_", " ")} active={status === s} />
        ))}
      </div>

      {requests.length === 0 ? (
        <div className="card grid place-items-center px-6 py-20 text-center text-muted">No requests here yet.</div>
      ) : (
        <ul className="grid gap-4">
          {requests.map((r) => {
            const type = CUSTOM_TYPES.find((t) => t.value === r.product_type);
            const size = CUSTOM_SIZES.find((s) => s.value === r.size);
            return (
              <li key={r.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted">
                      Request #{r.id} · {formatDate(r.created_at)}
                    </p>
                    <h2 className="mt-1 text-2xl font-bold">
                      {type?.label ?? r.product_type} · <span className="capitalize">{r.size}</span>
                    </h2>
                    <p className="text-sm text-muted">{size ? (r.product_type === "epoxy" ? size.epoxy : size.rug) : ""}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusSelect action={updateRequestStatusAction} id={r.id} value={r.status} options={REQUEST_STATUSES} />
                    <form action={deleteRequestAction}>
                      <input type="hidden" name="id" value={r.id} />
                      <ConfirmButton message="Delete this request and its images?" className="grid h-10 w-10 place-items-center rounded-full text-muted hover:bg-berry-400/15 hover:text-berry-600">
                        <Trash2 size={16} />
                      </ConfirmButton>
                    </form>
                  </div>
                </div>

                <div className="mt-4 grid gap-5 md:grid-cols-[1fr_1.2fr]">
                  <div>
                    <p className="font-bold">{r.name}</p>
                    <a href={`mailto:${r.email}?subject=Your Snorlaxin custom ${type?.label.toLowerCase() ?? ""} request (#${r.id})`} className="inline-flex items-center gap-1.5 text-sm font-bold text-snorlax-500 hover:underline">
                      <Mail size={14} /> {r.email}
                    </a>
                    <p className="mt-3 whitespace-pre-line rounded-2xl bg-snorlax-50 p-4 text-sm leading-relaxed dark:bg-snorlax-800/60">
                      {r.notes || <span className="text-muted">No extra notes.</span>}
                    </p>
                  </div>
                  <ul className="grid grid-cols-3 gap-2">
                    {r.images.map((src) => (
                      <li key={src} className="aspect-square overflow-hidden rounded-2xl bg-cream-200 dark:bg-snorlax-800">
                        <Link href={src} target="_blank" rel="noreferrer">
                          <img src={src} alt="" className="h-full w-full object-cover transition hover:scale-105" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function Filter({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link href={href} className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-bold capitalize transition ${active ? "border-snorlax-500 bg-snorlax-500 text-cream-50" : "border-line text-muted hover:text-snorlax-600"}`}>
      {label}
    </Link>
  );
}
