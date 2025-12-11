"use client";

import { Card } from "@/components/ui/card";
import { traineeClasses } from "@/data/trainee";
import { useParams, useRouter } from "next/navigation";

export default function TraineeClassDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const cls = traineeClasses.find((c) => c.id === id);

  if (!cls) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold text-slate-900">Class not found</h1>
        <button
          className="text-sm font-semibold text-emerald-800"
          onClick={() => router.push("/trainee/schedule")}
        >
          Back to schedule
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-emerald-700">Class details</p>
        <h1 className="text-2xl font-semibold text-slate-900">{cls.title}</h1>
        <p className="text-sm text-slate-600">
          {cls.trainer} • {cls.date} • {cls.time} • {cls.duration}
        </p>
      </div>

      <Card>
        <div className="space-y-3">
          <p className="text-sm text-slate-700">{cls.description}</p>
          <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-700">
            <Info label="Trainer" value={cls.trainer} />
            <Info label="Location" value={cls.location} />
            <Info label="Status" value={cls.status} />
            <Info label="Date & time" value={`${cls.date} · ${cls.time}`} />
          </div>
          <p className="text-xs text-slate-500">
            Reminder: arrive 10 minutes early to warm up.
          </p>
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

