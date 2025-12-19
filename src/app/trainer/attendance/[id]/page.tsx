"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  trainerAttendance,
  trainerClasses,
  trainerMembers,
} from "@/data/trainer";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function TrainerAttendanceDetail() {
  const params = useParams();
  const router = useRouter();
  const classId = params?.id as string;
  const cls = trainerClasses.find((c) => c.id === classId);

  const initialStatuses = useMemo(() => {
    const rec = trainerAttendance.find((r) => r.classId === classId);
    return rec?.statuses ?? {};
  }, [classId]);

  const [statuses, setStatuses] = useState<Record<string, "present" | "absent">>(
    initialStatuses
  );
  const [saved, setSaved] = useState(false);

  if (!cls) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">
          Class not found
        </h1>
        <Button variant="secondary" onClick={() => router.push("/trainer/attendance")}>
          Back to attendance
        </Button>
      </div>
    );
  }

  const members = trainerMembers.filter((m) => cls.members.includes(m.id));

  const toggle = (id: string) => {
    setStatuses((prev) => {
      const next = { ...prev };
      next[id] = next[id] === "present" ? "absent" : "present";
      return next;
    });
    setSaved(false);
  };

  const markAll = () => {
    const next: Record<string, "present" | "absent"> = {};
    members.forEach((m) => (next[m.id] = "present"));
    setStatuses(next);
    setSaved(false);
  };

  const submit = () => {
    setSaved(true); // mock save
  };

  const presentCount = Object.values(statuses).filter(
    (s) => s === "present"
  ).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Mark attendance</p>
          <h1 className="text-2xl font-semibold text-slate-900">{cls.title}</h1>
          <p className="text-sm text-slate-600">
            {cls.date} · {cls.time} · {cls.location}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={markAll}>
            Mark all present
          </Button>
          <Button onClick={submit}>Submit attendance</Button>
        </div>
      </div>

      {saved ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Attendance saved. You can edit anytime.
        </div>
      ) : null}

      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr className="text-left text-sm text-slate-600">
                <th className="px-4 py-3 font-semibold">Member</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {members.map((member) => {
                const status = statuses[member.id] ?? "absent";
                const isPresent = status === "present";
                return (
                  <tr key={member.id} className="hover:bg-slate-50 text-sm text-slate-700">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-500">ID: {member.id}</p>
                    </td>
                    <td className="px-4 py-3">{member.phone}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${isPresent
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-700"
                          }`}
                      >
                        {isPresent ? "Present" : "Absent"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant={isPresent ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => toggle(member.id)}
                      >
                        {isPresent ? "Mark absent" : "Mark present"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW */}
        <div className="md:hidden divide-y divide-slate-200">
          {members.map((member) => {
            const status = statuses[member.id] ?? "absent";
            const isPresent = status === "present";
            return (
              <div key={member.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{member.name}</h3>
                    <p className="text-xs text-slate-500">ID: {member.id}</p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${isPresent
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-700"
                      }`}
                  >
                    {isPresent ? "Present" : "Absent"}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  Phone: {member.phone}
                </div>
                <div className="pt-1">
                  <Button
                    variant={isPresent ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full border border-slate-200"
                    onClick={() => toggle(member.id)}
                  >
                    {isPresent ? "Mark absent" : "Mark present"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">Present</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {presentCount}
          </p>
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">Absent</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {members.length - presentCount}
          </p>
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">Submitted</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {saved ? "Yes" : "Not yet"}
          </p>
        </Card>
      </div>
    </div>
  );
}

