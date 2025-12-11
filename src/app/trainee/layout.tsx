"use client";

import { TraineeSidebar } from "@/components/layout/trainee-sidebar";
import { TraineeTopbar } from "@/components/layout/trainee-topbar";
import { useState } from "react";

export default function TraineeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <TraineeSidebar open={open} onClose={() => setOpen(false)} />
        <div className="flex flex-1 flex-col lg:pl-0">
          <TraineeTopbar onToggleSidebar={() => setOpen(true)} />
          <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

