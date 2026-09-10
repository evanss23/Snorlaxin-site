import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";
import { PageEnter } from "@/components/motion";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <PageEnter className="container-x py-10 md:py-16">
      <h1 className="text-4xl font-bold sm:text-5xl">
        <span className="text-gradient">Checkout</span>
      </h1>
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </PageEnter>
  );
}
