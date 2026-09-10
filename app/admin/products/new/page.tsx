import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <>
      <AdminHeader title="Add a product" body="It goes live in the shop as soon as you save." />
      <ProductForm />
    </>
  );
}
