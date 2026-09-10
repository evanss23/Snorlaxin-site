import { Reveal } from "./motion";

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  body?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal className={`${align === "center" ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      {eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-snorlax-500 dark:text-snorlax-300">{eyebrow}</p>}
      <h2 className="text-3xl font-bold leading-[1.1] sm:text-4xl md:text-5xl">{title}</h2>
      {body && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{body}</p>}
    </Reveal>
  );
}
