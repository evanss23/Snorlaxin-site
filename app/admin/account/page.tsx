import { AdminHeader } from "@/components/admin/AdminHeader";
import { ChangePasswordForm } from "@/components/admin/TeamForms";
import { requireUser } from "@/lib/auth";

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <>
      <AdminHeader title="Your account" body={`Signed in as ${user.email} (${user.role}).`} />
      <ChangePasswordForm />
    </>
  );
}
