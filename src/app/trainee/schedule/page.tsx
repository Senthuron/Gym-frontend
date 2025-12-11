"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TableRow } from "@/components/ui/table-row";
import { traineeClasses } from "@/data/trainee";
import Link from "next/link";
import { useMemo, useState } from "react";

const filters = ["All", "Today", "Week"] as const;

export default function TraineeSchedulePage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const filtered = useMemo(() => {
    const now = new Date();
    return traineeClasses.filter((cls) => {
      const matchesQuery =
        cls.title.toLowerCase().includes(query.toLowerCase()) ||
        cls.trainer.toLowerCase().includes(query.toLowerCase());
      const clsDate = new Date(cls.date);
      const diffDays =
        (clsDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      const isToday = clsDate.toDateString() === now.toDateString();
      const isWeek = diffDays >= 0 && diffDays <= 7;
      if (filter === "Today" && !isToday) return false;
      if (filter === "Week" && !isWeek) return false;
      return matchesQuery;
    });
  }, [query, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Schedule</p>
          <h1 className="text-xl font-semibold text-slate-900">
            Your upcoming classes
          </h1>
        </div>
        <Input
          placeholder="Search class or trainer"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leading="🔎"
          className="sm:max-w-xs"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              filter === f
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm">
        <div className="space-y-0 divide-y divide-slate-200 hidden md:block">
          <TableRow
            header
            cells={[
              "Class",
              "Trainer",
              "Date & time",
              "Duration",
              "Status",
              "",
            ]}
            className="grid-cols-[1.6fr,1.2fr,1.2fr,0.9fr,0.9fr,0.7fr] bg-slate-100 px-4"
          />
          {filtered.map((cls) => (
            <TableRow
              key={cls.id}
              cells={[
                <div key="title">
                  <p className="font-semibold text-slate-900">{cls.title}</p>
                  <p className="text-xs text-slate-500">{cls.location}</p>
                </div>,
                <span key="trainer" className="text-sm text-slate-600">
                  {cls.trainer}
                </span>,
                <span key="datetime" className="text-sm text-slate-600">
                  {cls.date} · {cls.time}
                </span>,
                <span key="duration" className="text-sm text-slate-600">
                  {cls.duration}
                </span>,
                <span
                  key="status"
                  className={`badge ${
                    cls.status === "Upcoming"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {cls.status}
                </span>,
                <Link
                  key="link"
                  href={`/trainee/schedule/${cls.id}`}
                  className="text-sm font-semibold text-emerald-800"
                >
                  Details
                </Link>,
              ]}
              className="grid-cols-[1.6fr,1.2fr,1.2fr,0.9fr,0.9fr,0.7fr] px-4 hover:bg-slate-50"
            />
          ))}
        </div>

        <div className="md:hidden divide-y divide-slate-200">
          {filtered.map((cls) => (
            <div key={cls.id} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{cls.title}</p>
                  <p className="text-xs text-slate-500">
                    {cls.trainer} • {cls.date} • {cls.time}
                  </p>
                </div>
                <Link
                  href={`/trainee/schedule/${cls.id}`}
                  className="text-sm font-semibold text-emerald-800"
                >
                  Details
                </Link>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600">
                <span className="font-semibold text-slate-500">Duration</span>
                <span>{cls.duration}</span>
                <span className="font-semibold text-slate-500">Status</span>
                <span>{cls.status}</span>
                <span className="font-semibold text-slate-500">Location</span>
                <span>{cls.location}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

