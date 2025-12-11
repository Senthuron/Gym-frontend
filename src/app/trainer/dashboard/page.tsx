"use client";

import { Card } from "@/components/ui/card";
import { TableRow } from "@/components/ui/table-row";
import {
  trainerAttendance,
  trainerClasses,
  trainerProfile,
} from "@/data/trainer";
import { formatDate } from "@/lib/utils";

const todayISO = new Date().toISOString().slice(0, 10);

export default function TrainerDashboard() {
  const todayClasses = trainerClasses.filter((c) => c.date === todayISO);
  const upcoming = trainerClasses.filter((c) => {
    const diffDays =
      (new Date(c.date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7 && c.date !== todayISO;
  });

  const totalSessions = trainerClasses.length;
  const completedSessions = trainerAttendance.length;
  const weeklyAttendancePercent = Math.round(
    trainerAttendance.reduce((acc, rec) => {
      const total = Object.keys(rec.statuses).length || 1;
      const present = Object.values(rec.statuses).filter(
        (s) => s === "present"
      ).length;
      return acc + present / total;
    }, 0) / trainerAttendance.length * 100
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-blue-700">Welcome back</p>
        <h1 className="text-2xl font-semibold text-slate-900">
          {trainerProfile.name}
        </h1>
        <p className="text-sm text-slate-600">
          Quick snapshot of your classes and attendance for the week.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">Weekly attendance</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {Number.isFinite(weeklyAttendancePercent)
              ? `${weeklyAttendancePercent}%`
              : "—"}
          </p>
          <p className="text-xs text-slate-500">
            Average present rate across submitted sessions.
          </p>
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">Sessions taught</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {completedSessions}
          </p>
          <p className="text-xs text-slate-500">
            Completed vs total: {completedSessions}/{totalSessions}
          </p>
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">Upcoming sessions</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {upcoming.length}
          </p>
          <p className="text-xs text-slate-500">
            Within the next 7 days.
          </p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Today’s classes">
          <div className="space-y-2">
            {todayClasses.length === 0 ? (
              <p className="text-sm text-slate-600">No classes today.</p>
            ) : (
              todayClasses.map((cls) => (
                <TableRow
                  key={cls.id}
                  cells={[
                    <div key="title">
                      <p className="font-semibold text-slate-900">
                        {cls.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(cls.date)} · {cls.time}
                      </p>
                    </div>,
                    <div key="members" className="text-sm text-slate-600">
                      {cls.enrolled} members
                    </div>,
                  ]}
                  className="grid-cols-[1.5fr,1fr]"
                />
              ))
            )}
          </div>
        </Card>

        <Card title="Upcoming (7 days)">
          <div className="space-y-2">
            {upcoming.length === 0 ? (
              <p className="text-sm text-slate-600">Nothing scheduled.</p>
            ) : (
              upcoming.map((cls) => (
                <TableRow
                  key={cls.id}
                  cells={[
                    <div key="title">
                      <p className="font-semibold text-slate-900">
                        {cls.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(cls.date)} · {cls.time}
                      </p>
                    </div>,
                    <div key="counts" className="text-sm text-slate-600">
                      {cls.enrolled}/{cls.capacity} enrolled
                    </div>,
                  ]}
                  className="grid-cols-[1.5fr,1fr]"
                />
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

