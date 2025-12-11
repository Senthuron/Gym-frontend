"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/trainee/dashboard", label: "Dashboard" },
  { href: "/trainee/schedule", label: "Class Schedule" },
  { href: "/trainee/attendance", label: "Attendance" },
  { href: "/trainee/attendance/history", label: "Attendance History" },
  { href: "/trainee/profile", label: "Profile" },
];

export function TraineeSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-white px-5 py-6 shadow-xl transition-transform lg:static lg:translate-x-0",
          "lg:sticky lg:top-0 lg:h-screen",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white font-semibold">
              TM
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Trainee</p>
              <p className="text-xs text-slate-500">Gym Mini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-2">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                  active
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-lg text-sm font-bold",
                    active ? "bg-white/20" : "bg-slate-100 text-slate-500"
                  )}
                  aria-hidden
                >
                  {item.label.charAt(0)}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            Need to logout?
          </p>
          <p className="mt-1 text-xs text-slate-500">
            You can sign out anytime for security.
          </p>
          <Link
            href="/login"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"
          >
            Logout →
          </Link>
        </div>
      </aside>
    </>
  );
}

