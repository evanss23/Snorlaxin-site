import Link from "next/link";
import { Eye, EyeOff, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { deleteProductAction, toggleProductAction } from "@/app/actions/products";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { formatPrice } from "@/lib/format";
import { listProducts } from "@/lib/queries";

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ created?: string }> }) {
  const { created } = await searchParams;
  const products = listProducts({ includeInactive: true });

  return (
    <>
      <AdminHeader title="Products" body={`${products.length} products in the catalogue.`}>
        <Link href="/admin/products/new" className="btn btn-primary btn-sm">
          <Plus size={16} /> Add product
        </Link>
      </AdminHeader>

      {created && <p className="mb-6 rounded-2xl bg-moss-500/15 px-4 py-3 text-sm font-bold text-moss-500">Product added. It&apos;s live in the shop.</p>}

      {products.length === 0 ? (
        <div className="card grid place-items-center px-6 py-20 text-center">
          <p className="font-display text-2xl font-semibold">No products yet.</p>
          <Link href="/admin/products/new" className="btn btn-primary mt-6">
            Add your first product
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3">
          {products.map((p) => (
            <li key={p.id} className={`card flex flex-wrap items-center gap-4 p-3 sm:flex-nowrap ${p.active ? "" : "opacity-60"}`}>
              <Link href={`/admin/products/${p.id}`} className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-cream-200 dark:bg-snorlax-800">
                {p.image_path && <img src={p.image_path} alt="" className="h-full w-full object-cover" />}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/products/${p.id}`} className="block truncate font-display text-lg font-semibold hover:text-snorlax-600">
                  {p.name}
                </Link>
                <p className="text-sm text-muted">
                  {p.category} · {formatPrice(p.price_cents)} ·{" "}
                  <span className={p.stock <= 3 ? "font-bold text-berry-500" : ""}>{p.stock} in stock</span>
                  {!p.active && " · hidden"}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <form action={toggleProductAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="field" value="featured" />
                  <button title={p.featured ? "Unfeature" : "Feature on home"} className={`grid h-10 w-10 place-items-center rounded-full transition hover:bg-snorlax-100 dark:hover:bg-snorlax-800 ${p.featured ? "text-cream-500" : "text-muted"}`}>
                    <Star size={17} fill={p.featured ? "currentColor" : "none"} />
                  </button>
                </form>
                <form action={toggleProductAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="field" value="active" />
                  <button title={p.active ? "Hide from shop" : "Show in shop"} className="grid h-10 w-10 place-items-center rounded-full text-muted transition hover:bg-snorlax-100 dark:hover:bg-snorlax-800">
                    {p.active ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </form>
                <Link href={`/admin/products/${p.id}`} title="Edit" className="grid h-10 w-10 place-items-center rounded-full text-muted transition hover:bg-snorlax-100 dark:hover:bg-snorlax-800">
                  <Pencil size={17} />
                </Link>
                <form action={deleteProductAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <ConfirmButton message={`Delete "${p.name}"? This can't be undone.`} className="grid h-10 w-10 place-items-center rounded-full text-muted transition hover:bg-berry-400/15 hover:text-berry-600">
                    <Trash2 size={17} />
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
