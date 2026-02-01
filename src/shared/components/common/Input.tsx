import type { InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, id, ...props }: Props) {
  const inputId = id ?? props.name ?? "input-field";
  const errorId = `${inputId}-error`;

  return (
    <section className="flex flex-col gap-1.5">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-semibold text-slate-700 ml-1 cursor-pointer"
        >
          {label}
        </label>
      )}

      <div className="relative group">
        <input
          id={inputId}
          {...props}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-2.5 text-sm transition-all outline-none",
            "focus:border-[#556b2f] focus:ring-4 focus:ring-[#556b2f]/10",
            error ? "border-red-400" : "border-slate-200 hover:border-slate-300",
            "disabled:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",
            className
          )}
        />
      </div>

      {error && (
        <p 
          id={errorId}
          role="alert" 
          className="ml-1 text-xs font-semibold text-red-600 animate-in fade-in slide-in-from-top-1"
        >
          {error}
        </p>
      )}
    </section>
  );
}