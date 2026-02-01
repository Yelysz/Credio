import type { SelectHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export function Select({ label, error, className, id, children, ...props }: Props) {
  const selectId = id ?? props.name ?? "select-field";
  const errorId = `${selectId}-error`;

  return (
    <section className="flex flex-col gap-1.5">
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-sm font-semibold text-slate-700 ml-1 cursor-pointer"
        >
          {label}
        </label>
      )}

      <div className="relative group">
        <select
          id={selectId}
          {...props}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full appearance-none rounded-xl border bg-white px-4 py-2.5 text-sm transition-all outline-none",
            "focus:border-[#556b2f] focus:ring-4 focus:ring-[#556b2f]/10",
            error ? "border-red-400" : "border-slate-200 hover:border-slate-300",
            "cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",
            className
          )}
        >
          {children}
        </select>
        
        <span 
          className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 group-hover:text-slate-500 transition-colors"
          aria-hidden="true"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
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