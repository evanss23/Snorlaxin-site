import type { Metadata } from "next";
import { CartView } from "@/components/CartView";
import { PageEnter } from "@/components/motion";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <PageEnter className="container-x py-10 md:py-16">
      <h1 className="text-4xl font-bold sm:text-5xl">
        Your <span className="text-gradient">cart</span>
      </h1>
      <div className="mt-8">
        <CartView />
      </div>
    </PageEnter>
  );
}
