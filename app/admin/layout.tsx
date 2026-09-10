import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireUser } from "@/lib/auth";
import { dashboardStats } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const stats = dashboardStats();
  return (
    <div className="container-x grid gap-6 py-8 lg:grid-cols-[16rem_1fr]">
      <AdminSidebar
        user={user}
        badges={{ "/admin/requests": stats.newRequests, "/admin/orders": stats.pendingOrders }}
      />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
