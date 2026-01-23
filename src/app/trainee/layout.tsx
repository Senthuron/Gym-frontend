"use client";

import { TraineeSidebar } from "@/components/layout/trainee-sidebar";
import { TraineeTopbar } from "@/components/layout/trainee-topbar";
import { Onboarding } from "@/components/trainee/Onboarding";
import { getUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function TraineeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const user = getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Only allow member users to access trainee pages
    if (user.role !== 'member') {
      // Redirect based on role
      if (user.role === 'admin') {
        router.push("/dashboard");
      } else if (user.role === 'trainer') {
        router.push("/trainer/dashboard");
      } else {
        router.push("/login");
      }
      return;
    }
  }, [router]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (!mounted) return null;

  const user = getUser();
  if (!user || user.role !== 'member') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
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

