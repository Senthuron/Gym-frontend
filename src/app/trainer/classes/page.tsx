"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TableRow } from "@/components/ui/table-row";
import { trainerClasses } from "@/data/trainer";
import Link from "next/link";
import { useMemo, useState } from "react";

const filters = ["All", "Today", "This week"] as const;

export default function TrainerClassesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const filtered = useMemo(() => {
    const now = new Date();
    return trainerClasses.filter((cls) => {
      const matchesQuery = cls.title
        .toLowerCase()
        .includes(query.toLowerCase());
      const clsDate = new Date(cls.date);
      const diffDays =
        (clsDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      const isToday = clsDate.toDateString() === now.toDateString();
      const isWeek = diffDays >= 0 && diffDays <= 7;

      if (filter === "Today" && !isToday) return false;
      if (filter === "This week" && !isWeek) return false;
      return matchesQuery;
    });
  }, [query, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">My Classes</p>
          <h1 className="text-xl font-semibold text-slate-900">
            Sessions assigned to you
          </h1>
        </div>
        <Input
          placeholder="Search class name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leading="🔎"
          className="sm:max-w-xs"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <Button
            key={f}
            variant={filter === f ? "primary" : "ghost"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <Card>
        <div className="space-y-2">
          <TableRow
            header
            cells={["Class", "Date & time", "Capacity", "Enrolled", ""]}
            className="grid-cols-[1.5fr,1.2fr,0.8fr,0.8fr,0.7fr]"
          />
          {filtered.map((cls) => (
            <TableRow
              key={cls.id}
              cells={[
                <div key="title">
                  <p className="font-semibold text-slate-900">{cls.title}</p>
                  <p className="text-xs text-slate-500">{cls.location}</p>
                </div>,
                <span key="time" className="text-sm text-slate-600">
                  {cls.date} · {cls.time} · {cls.duration}
                </span>,
                <span key="cap" className="text-sm font-semibold">
                  {cls.capacity}
                </span>,
                <span key="enrolled" className="text-sm text-slate-600">
                  {cls.enrolled}
                </span>,
                <Link
                  key="link"
                  href={`/trainer/classes/${cls.id}`}
                  className="text-sm font-semibold text-blue-700"
                >
                  Details
                </Link>,
              ]}
              className="grid-cols-[1.5fr,1.2fr,0.8fr,0.8fr,0.7fr]"
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

