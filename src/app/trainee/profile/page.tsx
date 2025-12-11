"use client";

import { Card } from "@/components/ui/card";
import { traineeProfile } from "@/data/trainee";
import Image from "next/image";
import Link from "next/link";

export default function TraineeProfilePage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Profile</p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Your information
          </h1>
        </div>
        <Link href="/trainee/profile/edit" className="text-sm font-semibold text-emerald-800">
          Edit profile
        </Link>
      </div>

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border border-slate-200">
            <Image
              src={traineeProfile.avatar}
              alt={traineeProfile.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-700 flex-1">
            <Info label="Name" value={traineeProfile.name} />
            <Info label="Phone" value={traineeProfile.phone} />
            <Info label="Email" value={traineeProfile.email} />
            <Info label="Age" value={`${traineeProfile.age}`} />
            <Info label="Membership plan" value={traineeProfile.membershipPlan} />
            <Info
              label="Expires"
              value={`${traineeProfile.membershipExpiry} • ${traineeProfile.membershipDaysLeft} days left`}
            />
            <Info label="Trainer" value={traineeProfile.trainer} />
            <Info
              label="Attendance"
              value={`${traineeProfile.attendancePercent}%`}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

