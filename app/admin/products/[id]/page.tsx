import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/queries";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product) notFound();
  return (
    <>
      <AdminHeader title={product.name} body="Edit details, swap the photo or update stock.">
        <Link href={`/shop/${product.slug}`} className="btn btn-ghost btn-sm" target="_blank">
          View in shop
        </Link>
      </AdminHeader>
      <ProductForm product={product} />
    </>
  );
}
