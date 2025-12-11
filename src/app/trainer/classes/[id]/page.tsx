"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TableRow } from "@/components/ui/table-row";
import {
  trainerClasses,
  trainerMembers,
  trainerProfile,
} from "@/data/trainer";
import { useParams, useRouter } from "next/navigation";

export default function TrainerClassDetail() {
  const params = useParams();
  const router = useRouter();
  const classId = params?.id as string;
  const cls = trainerClasses.find((c) => c.id === classId);

  if (!cls) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">
          Class not found
        </h1>
        <Button variant="secondary" onClick={() => router.push("/trainer/classes")}>
          Back to classes
        </Button>
      </div>
    );
  }

  const members = trainerMembers.filter((m) => cls.members.includes(m.id));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Class details</p>
          <h1 className="text-2xl font-semibold text-slate-900">{cls.title}</h1>
          <p className="text-sm text-slate-600">
            {cls.date} · {cls.time} · {cls.duration} · {cls.location}
          </p>
        </div>
        <Button onClick={() => router.push(`/trainer/attendance/${cls.id}`)}>
          Mark attendance
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">Class info</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Trainer" value={trainerProfile.name} />
              <Info label="Capacity" value={`${cls.capacity} spots`} />
              <Info label="Enrolled" value={`${cls.enrolled} members`} />
              <Info label="Duration" value={cls.duration} />
            </div>
          </div>
        </Card>
      </div>

      <Card title="Members (read-only)">
        <div className="space-y-2">
          <TableRow
            header
            cells={["Name", "Phone", "Status"]}
            className="grid-cols-[1.4fr,1fr,0.8fr]"
          />
          {members.map((member) => (
            <TableRow
              key={member.id}
              cells={[
                <div key="name">
                  <p className="font-semibold text-slate-900">{member.name}</p>
                  <p className="text-xs text-slate-500">ID: {member.id}</p>
                </div>,
                <span key="phone" className="text-sm text-slate-600">
                  {member.phone}
                </span>,
                <span key="status" className="badge bg-slate-100 text-slate-700">
                  Enrolled
                </span>,
              ]}
              className="grid-cols-[1.4fr,1fr,0.8fr]"
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

