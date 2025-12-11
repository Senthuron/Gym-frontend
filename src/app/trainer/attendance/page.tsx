"use client";

import { Card } from "@/components/ui/card";
import { TableRow } from "@/components/ui/table-row";
import { trainerClasses } from "@/data/trainer";
import Link from "next/link";

export default function TrainerAttendanceList() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-blue-700">Attendance</p>
        <h1 className="text-xl font-semibold text-slate-900">
          Select a class to mark or edit
        </h1>
      </div>

      <Card>
        <div className="space-y-2">
          <TableRow
            header
            cells={["Class", "Date & time", "Enrolled", ""]}
            className="grid-cols-[1.5fr,1.2fr,0.8fr,0.7fr]"
          />
          {trainerClasses.map((cls) => (
            <TableRow
              key={cls.id}
              cells={[
                <div key="title">
                  <p className="font-semibold text-slate-900">{cls.title}</p>
                  <p className="text-xs text-slate-500">{cls.location}</p>
                </div>,
                <span key="time" className="text-sm text-slate-600">
                  {cls.date} · {cls.time}
                </span>,
                <span key="enrolled" className="text-sm text-slate-600">
                  {cls.enrolled}/{cls.capacity}
                </span>,
                <Link
                  key="link"
                  href={`/trainer/attendance/${cls.id}`}
                  className="text-sm font-semibold text-blue-700"
                >
                  Mark / Edit
                </Link>,
              ]}
              className="grid-cols-[1.5fr,1.2fr,0.8fr,0.7fr]"
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

