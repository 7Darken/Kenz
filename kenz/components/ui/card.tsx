import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "article" | "section";
  subdued?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, as = "div", subdued = false, ...props }, ref) => {
    const Comp = as;
    return (
      <Comp
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] transition-colors",
          subdued ? "shadow-none" : "shadow-sm shadow-black/10",
          className,
        )}
        {...props}
      >
        <div className="relative z-10 h-full w-full p-6 md:p-8">{children}</div>
      </Comp>
    );
  },
);

Card.displayName = "Card";
