"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createProductAction, updateProductAction } from "@/app/actions/products";
import type { ActionState } from "@/app/actions/auth";
import { PRODUCT_CATEGORIES, type Product } from "@/lib/types";
import { ImageDrop } from "./ImageDrop";
import { SubmitButton } from "./SubmitButton";
import { FormMessage } from "./FormMessage";
import { ActionForm } from "../ActionForm";

export function ProductForm({ product }: { product?: Product }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(product ? updateProductAction : createProductAction, {});

  return (
    <ActionForm action={action} className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="card space-y-6 p-6 sm:p-8">
        <div>
          <label className="label" htmlFor="name">
            Name
          </label>
          <input id="name" name="name" required defaultValue={product?.name} className="field text-lg font-bold" placeholder="Sleepy Snorlax Plush" />
        </div>
        <div>
          <label className="label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            defaultValue={product?.description}
            className="field resize-y"
            placeholder="What is it, what's it made of, why will people love it?"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="price">
              Price (USD)
            </label>
            <input id="price" name="price" type="number" step="0.01" min="0" required defaultValue={product ? (product.price_cents / 100).toFixed(2) : ""} className="field" placeholder="29.99" />
          </div>
          <div>
            <label className="label" htmlFor="stock">
              Stock
            </label>
            <input id="stock" name="stock" type="number" min="0" step="1" defaultValue={product?.stock ?? 1} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="category">
              Category
            </label>
            <select id="category" name="category" defaultValue={product?.category ?? "Plush"} className="field">
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 text-sm font-bold">
            <input type="checkbox" name="featured" defaultChecked={product ? product.featured === 1 : false} className="h-5 w-5 accent-snorlax-500" />
            Featured on the home page
          </label>
          <label className="flex items-center gap-3 text-sm font-bold">
            <input type="checkbox" name="active" defaultChecked={product ? product.active === 1 : true} className="h-5 w-5 accent-snorlax-500" />
            Visible in the shop
          </label>
        </div>
        <FormMessage error={state.error} success={state.success} />
        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton pending={pending}>{product ? "Save changes" : "Add product"}</SubmitButton>
          <Link href="/admin/products" className="btn btn-ghost">
            Cancel
          </Link>
        </div>
      </div>

      <div className="card h-fit space-y-4 p-6">
        <span className="label">Product photo</span>
        <ImageDrop name="image" current={product?.image_path} />
        {product?.image_path && (
          <label className="flex items-center gap-3 text-sm font-bold text-muted">
            <input type="checkbox" name="remove_image" className="h-4 w-4 accent-berry-500" /> Remove current photo
          </label>
        )}
        <p className="text-xs text-muted">Square photos look best. Around 1200×1200 px is plenty.</p>
      </div>
    </ActionForm>
  );
}
