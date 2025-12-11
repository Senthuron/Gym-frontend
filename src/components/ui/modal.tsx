import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  className?: string;
};

export function Modal({
  open,
  title,
  children,
  onClose,
  footer,
  className,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-8 backdrop-blur-sm">
      <div
        className={cn(
          "w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200",
          className
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500">
              Make quick edits without leaving the page.
            </p>
          </div>
          <Button
            aria-label="Close modal"
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0"
          >
            ✕
          </Button>
        </div>
        <div className="px-5 py-4 text-sm text-slate-700">{children}</div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-5 py-3">
          {footer ?? (
            <>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button>Save</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

