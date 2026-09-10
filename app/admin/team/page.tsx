import { Trash2 } from "lucide-react";
import { deleteUserAction } from "@/app/actions/users";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { CreateUserForm } from "@/components/admin/TeamForms";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { listUsers } from "@/lib/queries";

export default async function AdminTeam() {
  const me = await requireAdmin();
  const users = listUsers();
  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <>
      <AdminHeader title="Team" body="Everyone who can sign in and manage the shop." />
      <div className="grid gap-6">
        <ul className="card divide-y divide-[var(--line)] p-2">
          {users.map((u) => (
            <li key={u.id} className="flex items-center gap-4 px-3 py-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-snorlax-100 font-display font-bold text-snorlax-700 dark:bg-snorlax-800 dark:text-snorlax-100">
                {u.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">
                  {u.name} {u.id === me.id && <span className="text-xs font-bold text-muted">(you)</span>}
                </p>
                <p className="truncate text-sm text-muted">{u.email}</p>
              </div>
              <span className="chip capitalize">{u.role}</span>
              <span className="hidden text-xs text-muted sm:block">Joined {formatDate(u.created_at)}</span>
              {u.id !== me.id && !(u.role === "admin" && adminCount <= 1) && (
                <form action={deleteUserAction}>
                  <input type="hidden" name="id" value={u.id} />
                  <ConfirmButton message={`Remove ${u.name}'s access?`} className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-berry-400/15 hover:text-berry-600">
                    <Trash2 size={15} />
                  </ConfirmButton>
                </form>
              )}
            </li>
          ))}
        </ul>
        <CreateUserForm />
      </div>
    </>
  );
}
