import type { InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Checkbox({ label, error, className, id, ...props }: Props) {
  const checkboxId = id ?? props.name ?? "checkbox-field";
  const errorId = `${checkboxId}-error`;

  return (
    <section className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2.5 group cursor-pointer">
        <input
          id={checkboxId}
          type="checkbox"
          {...props}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-5 w-5 rounded border-slate-300 cursor-pointer transition-all",
            "accent-[#556b2f] text-[#556b2f]",
            "focus:ring-4 focus:ring-[#556b2f]/10 focus:ring-offset-0",
            error ? "border-red-400" : "border-slate-300 group-hover:border-[#556b2f]",
            className
          )}
        />
        
        {label && (
          <label 
            htmlFor={checkboxId} 
            className="text-sm font-semibold text-slate-600 cursor-pointer select-none group-hover:text-[#2d3a1a] transition-colors"
          >
            {label}
          </label>
        )}
      </div>

      {error && (
        <p 
          id={errorId}
          role="alert" 
          className="ml-7 text-xs font-bold text-red-600 animate-in fade-in slide-in-from-top-1"
        >
          {error}
        </p>
      )}
    </section>
  );
}