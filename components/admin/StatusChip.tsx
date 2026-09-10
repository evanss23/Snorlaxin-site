export function StatusChip({ status }: { status: string }) {
  const tone: Record<string, string> = {
    new: "bg-berry-400/20 text-berry-600",
    pending: "bg-berry-400/20 text-berry-600",
    reviewing: "bg-cream-300/60 text-snorlax-800 dark:bg-cream-400/20 dark:text-cream-200",
    quoted: "bg-snorlax-100 text-snorlax-700 dark:bg-snorlax-800 dark:text-snorlax-100",
    paid: "bg-snorlax-100 text-snorlax-700 dark:bg-snorlax-800 dark:text-snorlax-100",
    in_progress: "bg-snorlax-100 text-snorlax-700 dark:bg-snorlax-800 dark:text-snorlax-100",
    shipped: "bg-snorlax-100 text-snorlax-700 dark:bg-snorlax-800 dark:text-snorlax-100",
    completed: "bg-moss-500/15 text-moss-500",
    declined: "bg-snorlax-900/10 text-muted",
    cancelled: "bg-snorlax-900/10 text-muted",
  };
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${tone[status] ?? "bg-snorlax-100 text-snorlax-700"}`}>
      {status.replace("_", " ")}
    </span>
  );
}
