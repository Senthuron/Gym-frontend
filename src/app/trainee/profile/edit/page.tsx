"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { traineeProfile } from "@/data/trainee";
import { useState } from "react";

export default function TraineeProfileEditPage() {
  const [form, setForm] = useState({
    name: traineeProfile.name,
    phone: traineeProfile.phone,
    email: traineeProfile.email,
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!form.name || !form.email || !form.phone) {
      setError("Name, phone, and email are required.");
      return;
    }
    if (form.password && form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError(null);
    setSaved(true); // mock save
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-emerald-700">Profile</p>
        <h1 className="text-2xl font-semibold text-slate-900">
          Edit your details
        </h1>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {saved ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Changes saved (mock).
        </div>
      ) : null}

      <Card>
        <div className="space-y-3">
          <Input
            label="Full name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            hint="Only set this if you want to change it."
          />
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave}>Save changes</Button>
            <Button variant="secondary" onClick={() => setSaved(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

