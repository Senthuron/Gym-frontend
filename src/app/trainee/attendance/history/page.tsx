"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TableRow } from "@/components/ui/table-row";
import { attendanceHistory } from "@/data/trainee";
import { formatDate } from "@/lib/utils";
import { useMemo, useState } from "react";

export default function TraineeAttendanceHistory() {
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState("All");

  const filtered = useMemo(() => {
    return attendanceHistory.filter((item) => {
      const matchesQuery = item.className
        .toLowerCase()
        .includes(query.toLowerCase());
      const itemMonth = item.date.slice(0, 7); // YYYY-MM
      const matchesMonth = month === "All" || itemMonth === month;
      return matchesQuery && matchesMonth;
    });
  }, [query, month]);

  const months = Array.from(
    new Set(attendanceHistory.map((item) => item.date.slice(0, 7)))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">
            Attendance history
          </p>
          <h1 className="text-xl font-semibold text-slate-900">
            All classes and statuses
          </h1>
        </div>
        <Input
          placeholder="Search class"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leading="🔎"
          className="sm:max-w-xs"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            month === "All"
              ? "bg-emerald-600 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
          onClick={() => setMonth("All")}
        >
          All months
        </button>
        {months.map((m) => (
          <button
            key={m}
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              month === m
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
            onClick={() => setMonth(m)}
          >
            {m}
          </button>
        ))}
      </div>

      <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm">
        <div className="space-y-0 divide-y divide-slate-200 hidden md:block">
          <TableRow
            header
            cells={["Class", "Date", "Status"]}
            className="grid-cols-[1.5fr,1fr,0.8fr] bg-slate-100 px-4"
          />
          {filtered.map((item) => (
            <TableRow
              key={`${item.classId}-${item.date}`}
              cells={[
                <span key="name" className="text-sm font-semibold text-slate-900">
                  {item.className}
                </span>,
                <span key="date" className="text-sm text-slate-600">
                  {formatDate(item.date)}
                </span>,
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
              className="grid-cols-[1.5fr,1fr,0.8fr] px-4 hover:bg-slate-50"
            />
          ))}
        </div>

        <div className="md:hidden divide-y divide-slate-200">
          {filtered.map((item) => (
            <div key={`${item.classId}-${item.date}`} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    {item.className}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(item.date)}
                  </p>
                </div>
                <span
                  className={`badge ${
                    item.status === "Present"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

