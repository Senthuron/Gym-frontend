"use client";

import { Card } from "@/components/ui/card";
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

      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr className="text-left text-sm text-slate-600">
                <th className="px-4 py-3 font-semibold">Class</th>
                <th className="px-4 py-3 font-semibold">Date & Time</th>
                <th className="px-4 py-3 font-semibold">Enrolled</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {trainerClasses.map((cls) => (
                <tr key={cls.id} className="hover:bg-slate-50 text-sm text-slate-700">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{cls.title}</p>
                    <p className="text-xs text-slate-500">{cls.location}</p>
                  </td>
                  <td className="px-4 py-3">
                    {cls.date} · {cls.time}
                  </td>
                  <td className="px-4 py-3">
                    {cls.enrolled}/{cls.capacity}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/trainer/attendance/${cls.id}`}
                      className="text-sm font-semibold text-blue-700 hover:text-blue-800"
                    >
                      Mark / Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW */}
        <div className="md:hidden divide-y divide-slate-200">
          {trainerClasses.map((cls) => (
            <div key={cls.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{cls.title}</h3>
                  <p className="text-xs text-slate-500">{cls.location}</p>
                </div>
                <span className="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600">
                  {cls.enrolled}/{cls.capacity}
                </span>
              </div>
              <div className="flex items-center text-xs text-slate-600">
                <span className="font-medium">
                  {cls.date} · {cls.time}
                </span>
              </div>
              <div className="pt-1">
                <Link
                  href={`/trainer/attendance/${cls.id}`}
                  className="block w-full text-center py-2 text-sm font-semibold text-blue-700 border border-blue-100 rounded-lg bg-blue-50 hover:bg-blue-100"
                >
                  Mark / Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

