"use client";

import { Card } from "@/components/ui/card";
import { TableRow } from "@/components/ui/table-row";
import { attendanceHistory, traineeClasses, traineeProfile } from "@/data/trainee";
import { formatDate } from "@/lib/utils";

export default function TraineeDashboard() {
  const upcoming = traineeClasses
    .filter((cls) => cls.status === "Upcoming")
    .slice(0, 4);

  const lastAttendance = attendanceHistory.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-emerald-700">Welcome back</p>
        <h1 className="text-2xl font-semibold text-slate-900">
          {traineeProfile.name}
        </h1>
        <p className="text-sm text-slate-600">
          Track your membership, attendance, and next classes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">Active plan</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {traineeProfile.membershipPlan}
          </p>
          <p className="text-sm text-slate-600">
            Expires {formatDate(traineeProfile.membershipExpiry)} •{" "}
            {traineeProfile.membershipDaysLeft} days left
          </p>
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">
            Attendance summary
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {traineeProfile.attendancePercent}%
          </p>
          <div className="mt-3 h-2 rounded-full bg-slate-100">
            <span
              className="block h-full rounded-full bg-emerald-600"
              style={{ width: `${traineeProfile.attendancePercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Weekly mock trend improving
          </p>
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">Trainer</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {traineeProfile.trainer}
          </p>
          <p className="text-sm text-slate-600">
            Contact: {traineeProfile.trainerContact ?? "—"}
          </p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Upcoming classes">
          <div className="space-y-2">
            {upcoming.map((cls) => (
              <TableRow
                key={cls.id}
                cells={[
                  <div key="title">
                    <p className="font-semibold text-slate-900">{cls.title}</p>
                    <p className="text-xs text-slate-500">
                      {cls.trainer} • {formatDate(cls.date)} • {cls.time}
                    </p>
                  </div>,
                  <span key="duration" className="text-sm text-slate-600">
                    {cls.duration}
                  </span>,
                ]}
                className="grid-cols-[1.6fr,0.8fr]"
              />
            ))}
          </div>
        </Card>

        <Card title="Recent attendance">
          <div className="space-y-2">
            {lastAttendance.map((item) => (
              <TableRow
                key={item.classId}
                cells={[
                  <div key="name">
                    <p className="font-semibold text-slate-900">
                      {item.className}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(item.date)}
                    </p>
                  </div>,
                  <span
                    key="status"
                    className={`badge ${
                      item.status === "Present"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.status}
                  </span>,
                ]}
                className="grid-cols-[1.6fr,0.8fr]"
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

