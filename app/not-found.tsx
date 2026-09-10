import Link from "next/link";
import { Mascot } from "@/components/Mascot";

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[70vh] place-items-center py-16 text-center">
      <div>
        <Mascot className="mx-auto max-w-sm" />
        <h1 className="mt-6 text-4xl font-bold sm:text-5xl">Snorlax is blocking the path.</h1>
        <p className="mt-3 text-muted">We couldn&apos;t find that page. Maybe it wandered off for a nap.</p>
        <Link href="/" className="btn btn-primary mt-8">
          Back home
        </Link>
      </div>
    </div>
  );
}
