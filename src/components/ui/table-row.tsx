import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type TableRowProps = {
  cells: ReactNode[];
  header?: boolean;
  className?: string;
  onClick?: () => void;
};

export function TableRow({
  cells,
  header = false,
  className,
  onClick,
}: TableRowProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-3 rounded-xl px-3 py-3 text-sm",
        header
          ? "bg-slate-50 font-semibold text-slate-600"
          : "bg-white shadow-sm ring-1 ring-slate-100 hover:ring-blue-200",
        onClick && "cursor-pointer transition hover:-translate-y-0.5",
        className
      )}
      onClick={onClick}
    >
      {cells.map((cell, index) => (
        <div key={index} className="truncate">
          {cell}
        </div>
      ))}
    </div>
  );
}

