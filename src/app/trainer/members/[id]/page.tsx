"use client";

import { Card } from "@/components/ui/card";
import { TableRow } from "@/components/ui/table-row";
import {
  trainerAttendance,
  trainerClasses,
  trainerMembers,
} from "@/data/trainer";
import { useParams, useRouter } from "next/navigation";

export default function TrainerMemberProfile() {
  const params = useParams();
  const router = useRouter();
  const memberId = params?.id as string;
  const member = trainerMembers.find((m) => m.id === memberId);

  if (!member) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">
          Member not found
        </h1>
        <button
          className="text-sm font-semibold text-blue-700"
          onClick={() => router.push("/trainer/members")}
        >
          Back to members
        </button>
      </div>
    );
  }

  const classRefs = member.classes
    .map((id) => trainerClasses.find((c) => c.id === id))
    .filter(Boolean);

  const totalSessions = trainerAttendance.filter((rec) =>
    Object.keys(rec.statuses).includes(member.id)
  );
  const presentCount = totalSessions.filter(
    (rec) => rec.statuses[member.id] === "present"
  ).length;
  const attendanceRate =
    totalSessions.length > 0
      ? Math.round((presentCount / totalSessions.length) * 100)
      : member.attendanceRate;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-blue-700">Member profile</p>
        <h1 className="text-2xl font-semibold text-slate-900">{member.name}</h1>
        <p className="text-sm text-slate-600">Phone: {member.phone}</p>
        <p className="text-sm text-slate-600">Age: {member.age}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">Classes with you</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {member.classes.length}
          </p>
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">Attendance</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {attendanceRate}%
          </p>
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">Present sessions</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {presentCount}
          </p>
        </Card>
      </div>

      <Card title="Classes with this trainer">
        <div className="space-y-2">
          <TableRow
            header
            cells={["Class", "Date", "Time", "Status"]}
            className="grid-cols-[1.3fr,0.9fr,0.9fr,0.8fr]"
          />
          {classRefs.map((cls) => (
            <TableRow
              key={cls!.id}
              cells={[
                <div key="title">
                  <p className="font-semibold text-slate-900">{cls!.title}</p>
                  <p className="text-xs text-slate-500">{cls!.location}</p>
                </div>,
                <span key="date" className="text-sm text-slate-600">
                  {cls!.date}
                </span>,
                <span key="time" className="text-sm text-slate-600">
                  {cls!.time}
                </span>,
                <span
                  key="status"
                  className="badge bg-slate-100 text-slate-700"
                >
                  Enrolled
                </span>,
              ]}
              className="grid-cols-[1.3fr,0.9fr,0.9fr,0.8fr]"
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

