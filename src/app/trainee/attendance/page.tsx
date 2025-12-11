"use client";

import { Card } from "@/components/ui/card";
import { TableRow } from "@/components/ui/table-row";
import { attendanceHistory, traineeProfile } from "@/data/trainee";
import { formatDate } from "@/lib/utils";

export default function TraineeAttendanceOverview() {
  const totalPresent = attendanceHistory.filter(
    (h) => h.status === "Present"
  ).length;
  const totalAbsent = attendanceHistory.length - totalPresent;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-emerald-700">Attendance</p>
        <h1 className="text-2xl font-semibold text-slate-900">
          Overview & recent history
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">
            Attendance percent
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
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">
            Total classes attended
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {totalPresent}
          </p>
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">
            Total missed classes
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {totalAbsent}
          </p>
        </Card>
      </div>

      <Card title="Recent attendance">
        <div className="space-y-2">
          {attendanceHistory.slice(0, 5).map((item) => (
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
  );
}

