import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Helper for merging tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", isLoading, children, disabled, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-xl px-6 py-3 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 text-sm sm:text-base";

    const variants = {
      primary:
        "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 focus:ring-[var(--color-primary)]",
      outline:
        "border-2 border-slate-200 text-slate-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] bg-transparent focus:ring-slate-200",
      ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
