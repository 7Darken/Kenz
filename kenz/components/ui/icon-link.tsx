import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type IconLinkProps = HTMLAttributes<HTMLAnchorElement> & {
  href: string;
  label: string;
  icon?: React.ReactNode;
  subtle?: boolean;
};

export function IconLink({ href, label, icon, subtle = false, className, ...props }: IconLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-colors",
        subtle
          ? "text-[var(--muted)] hover:text-[var(--foreground)]"
          : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
        className,
      )}
      {...props}
    >
      <span className="flex items-center justify-center text-base">{icon}</span>
      <span>{label}</span>
      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
