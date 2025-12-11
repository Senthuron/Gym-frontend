import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
};

export function Input({
  label,
  hint,
  error,
  className,
  leading,
  trailing,
  ...props
}: InputProps) {
  const hasError = Boolean(error);

  return (
    <label className="flex w-full flex-col gap-1 text-sm font-medium text-slate-800">
      {label}
      <div
        className={cn(
          "flex h-11 items-center gap-2 rounded-lg border bg-white px-3 shadow-inner transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100",
          hasError && "border-red-400 focus-within:ring-red-100",
          className
        )}
      >
        {leading ? (
          <span className="text-slate-400" aria-hidden>
            {leading}
          </span>
        ) : null}
        <input
          className="h-full w-full bg-transparent text-sm font-normal text-slate-900 outline-none placeholder:text-slate-400"
          {...props}
        />
        {trailing ? (
          <span className="text-slate-400" aria-hidden>
            {trailing}
          </span>
        ) : null}
      </div>
      <div className="min-h-[18px] text-xs font-normal text-slate-500">
        {hasError ? <span className="text-red-500">{error}</span> : hint}
      </div>
    </label>
  );
}

