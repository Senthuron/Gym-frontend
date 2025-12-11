import { Card } from "@/components/ui/card";
import { TableRow } from "@/components/ui/table-row";
import { classes } from "@/data/classes";
import { members } from "@/data/members";
import { recentActivities, revenueTrend } from "@/data/metrics";

export default function DashboardPage() {
  const upcomingClasses = classes.slice(0, 3);
  const recentMembers = members.slice(0, 4);
  const activeMembers = members.filter((m) => m.status === "Active").length;
  const weeklyClasses = classes.length;
  const attendancePercent = Math.round(
    (classes.reduce((acc, cls) => acc + cls.booked / cls.capacity, 0) /
      classes.length) *
      100
  );
  const now = new Date();
  const expiringSoon = members.filter((m) => {
    const days =
      (new Date(m.nextBilling).getTime() - now.getTime()) /
      (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 7;
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">Active members</p>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-semibold text-slate-900">
              {activeMembers}
            </p>
            <span className="badge bg-emerald-50 text-emerald-700">Live</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Members currently in good standing.
          </p>
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">
            Expiring in 7 days
          </p>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-semibold text-slate-900">
              {expiringSoon.length}
            </p>
            <span className="badge bg-amber-50 text-amber-700">Renewals</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Next billing approaching. Prompt outreach.
          </p>
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">
            Weekly classes
          </p>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-semibold text-slate-900">
              {weeklyClasses}
            </p>
            <span className="badge bg-blue-50 text-blue-700">This week</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Total scheduled sessions.
          </p>
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">
            Attendance percentage
          </p>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-semibold text-slate-900">
              {attendancePercent}%
            </p>
            <span className="badge bg-indigo-50 text-indigo-700">Fill</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Average class fill based on current bookings.
          </p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <header className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-blue-700">Revenue trend</p>
              <p className="text-sm text-slate-500">
                Last 7 days • mock data
              </p>
            </div>
            <div className="badge bg-emerald-50 text-emerald-700">
              Stable growth
            </div>
          </header>
          <div className="flex items-end gap-3">
            {revenueTrend.map((point) => (
              <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-xl bg-gradient-to-t from-blue-200 via-blue-400 to-blue-600 shadow-inner"
                  style={{ height: `${point.value * 6}px` }}
                />
                <p className="text-xs text-slate-500">{point.label}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent activity" className="lg:col-span-1">
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.title}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {activity.title}
                  </p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
                <span className="badge bg-blue-100 text-blue-700">
                  {activity.tag}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Upcoming classes" action={<span className="text-sm text-blue-700">View all</span>}>
          <div className="space-y-3">
            {upcomingClasses.map((item) => (
              <TableRow
                key={item.id}
                cells={[
                  <div key="title">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">
                      {item.time} · {item.location}
                    </p>
                  </div>,
                  <div key="coach" className="text-sm text-slate-600">
                    Coach {item.coach}
                  </div>,
                  <div key="capacity" className="text-sm font-semibold text-blue-700">
                    {item.booked}/{item.capacity} booked
                  </div>,
                ]}
                className="grid-cols-[1.5fr,1fr,1fr]"
              />
            ))}
          </div>
        </Card>

        <Card title="Recent members" action={<span className="text-sm text-blue-700">Manage</span>}>
          <div className="space-y-3">
            {recentMembers.map((member) => (
              <TableRow
                key={member.id}
                cells={[
                  <div key="name">
                    <p className="font-semibold text-slate-900">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.email}</p>
                  </div>,
                  <div key="plan" className="text-sm text-slate-600">
                    {member.plan} plan
                  </div>,
                  <div key="status">
                    <span className="badge bg-emerald-50 text-emerald-700">
                      {member.status}
                    </span>
                  </div>,
                ]}
                className="grid-cols-[1.5fr,1fr,0.8fr]"
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

