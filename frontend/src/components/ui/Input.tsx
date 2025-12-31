import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "./Button"; // Reusing cn helper

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="text-sm font-semibold text-[var(--color-text-main)] ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "flex w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
            error
              ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-100"
              : "",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs font-medium text-[var(--color-error)] ml-1 animate-pulse">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
