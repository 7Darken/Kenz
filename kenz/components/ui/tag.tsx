import { cn } from "@/lib/utils";

type TagProps = React.HTMLAttributes<HTMLSpanElement>;

export function Tag({ className, children, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)]/70 px-3 py-1 text-xs font-medium tracking-wide text-[var(--accent)] shadow-sm shadow-[var(--accent-soft)]/40 backdrop-blur",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
