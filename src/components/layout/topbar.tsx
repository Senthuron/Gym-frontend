"use client";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

type TopbarProps = {
  onToggleSidebar: () => void;
};

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard Overview",
  "/members": "Members",
  "/classes": "Classes & Schedule",
  "/attendance": "Attendance",
  "/settings": "Settings",
};

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const pathname = usePathname();
  const title =
    pageTitles[pathname] ??
    "Gym Mini Admin";

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <button
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        onClick={onToggleSidebar}
        aria-label="Open navigation"
      >
        ☰
      </button>

      <div className="flex flex-1 flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          Admin
        </p>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      </div>

      <div className="hidden w-full max-w-md lg:block">
        <div className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 shadow-inner focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
          <span className="text-slate-400" aria-hidden>
            🔎
          </span>
          <input
            className="h-full w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="Search members, classes, or invoices"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" className="hidden md:inline-flex">
          + Quick Action
        </Button>
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 text-white grid place-items-center font-semibold">
          A
        </div>
      </div>
    </header>
  );
}

