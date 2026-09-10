import Link from "next/link";
import { MascotMark } from "./Mascot";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <MascotMark />
            <span className="font-display text-2xl font-bold">
              Snorlax<span className="text-snorlax-500 dark:text-snorlax-300">in</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Handmade and hand-picked Pokémon merch for people who take their naps seriously.
            Plush, pins, apparel, hand-poured epoxy and tufted rugs, all with a dreamy Snorlax twist.
          </p>
        </div>
        <FooterCol
          title="Shop"
          links={[
            ["All products", "/shop"],
            ["Plush", "/shop?category=Plush"],
            ["Apparel", "/shop?category=Apparel"],
            ["Epoxy & Rugs", "/shop?category=Epoxy"],
          ]}
        />
        <FooterCol
          title="Custom"
          links={[
            ["Request a custom piece", "/custom"],
            ["Epoxy", "/custom?type=epoxy"],
            ["Rugs", "/custom?type=rug"],
            ["Gallery", "/gallery"],
          ]}
        />
        <FooterCol
          title="Snorlaxin"
          links={[
            ["About", "/about"],
            ["Team login", "/login"],
          ]}
        />
      </div>
      <div className="container-x flex flex-col items-center justify-between gap-3 border-t border-line py-6 text-xs text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} Snorlaxin. Made with love and a lot of naps.</p>
        <p>Pokémon and Snorlax are trademarks of Nintendo / Game Freak. Snorlaxin is a fan-made shop.</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-sm font-bold uppercase tracking-widest text-muted">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="text-sm font-semibold transition hover:text-snorlax-500">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
