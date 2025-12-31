import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "./Button";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-slate-100 bg-[var(--color-surface)] text-[var(--color-text-main)] shadow-[var(--shadow-card)] p-6 sm:p-8",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
