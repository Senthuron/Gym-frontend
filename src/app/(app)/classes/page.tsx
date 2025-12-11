"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ClassItem, classes } from "@/data/classes";
import { useMemo, useState } from "react";

const levelColors = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-blue-50 text-blue-700",
  Advanced: "bg-rose-50 text-rose-700",
};

export default function ClassesPage() {
  const [list, setList] = useState<ClassItem[]>(classes);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<keyof typeof levelColors | "All">("All");
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<ClassItem | null>(null);
  const [form, setForm] = useState({
    title: "",
    coach: "",
    capacity: 12,
    booked: 0,
    time: "",
    level: "Beginner" as ClassItem["level"],
    location: "",
  });

  const filtered = useMemo(() => {
    return list.filter((cls) => {
      const matchesLevel = level === "All" || cls.level === level;
      const matchesQuery = cls.title
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesLevel && matchesQuery;
    });
  }, [query, level, list]);

  const resetForm = () => {
    setForm({
      title: "",
      coach: "",
      capacity: 12,
      booked: 0,
      time: "",
      level: "Beginner",
      location: "",
    });
  };

  const handleSave = () => {
    if (!form.title || !form.coach || !form.time) return;
    if (editing) {
      setList((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...editing, ...form } : c))
      );
      setEditing(null);
    } else {
      const newClass: ClassItem = {
        ...form,
        id: `C-${Math.floor(400 + Math.random() * 100)}`,
      };
      setList((prev) => [newClass, ...prev]);
    }
    resetForm();
    setOpenModal(false);
  };

  const startEdit = (cls: ClassItem) => {
    setEditing(cls);
    setForm({
      title: cls.title,
      coach: cls.coach,
      capacity: cls.capacity,
      booked: cls.booked,
      time: cls.time,
      level: cls.level,
      location: cls.location,
    });
    setOpenModal(true);
  };

  const handleDelete = (id: string) => {
    setList((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Classes</p>
          <h2 className="text-xl font-semibold text-slate-900">
            Schedule & capacity
          </h2>
        </div>
        <Button onClick={() => setOpenModal(true)}>+ New class</Button>
      </div>

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Input
            placeholder="Search classes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leading="🔎"
            className="md:max-w-xs"
          />
          <div className="flex flex-wrap items-center gap-2">
            {(["All", "Beginner", "Intermediate", "Advanced"] as const).map(
              (item) => (
                <Button
                  key={item}
                  variant={level === item ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setLevel(item)}
                >
                  {item}
                </Button>
              )
            )}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((cls) => {
            const fill = Math.round((cls.booked / cls.capacity) * 100);
            return (
              <div
                key={cls.id}
                className="card-surface space-y-3 p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {cls.title}
                    </p>
                    <p className="text-xs text-slate-500">Coach {cls.coach}</p>
                  </div>
                  <span className={`badge ${levelColors[cls.level]}`}>
                    {cls.level}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>
                    {cls.time} · {cls.location}
                  </span>
                  <div className="flex gap-2 text-xs font-semibold">
                    <button
                      className="text-blue-700 hover:underline"
                      onClick={() => startEdit(cls)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-rose-600 hover:underline"
                      onClick={() => handleDelete(cls.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="rounded-xl bg-slate-100 p-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>Capacity</span>
                    <span>{fill}% full</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white">
                    <span
                      className="block h-full rounded-full bg-blue-300"
                      style={{ width: `${fill}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {cls.booked} of {cls.capacity} spots taken
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditing(null);
          resetForm();
        }}
        title={editing ? "Edit class" : "Create class"}
      >
        <div className="space-y-3">
          <Input
            label="Class name"
            placeholder="e.g. Strength Foundations"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Coach"
              placeholder="Trainer name"
              value={form.coach}
              onChange={(e) => setForm((f) => ({ ...f, coach: e.target.value }))}
            />
            <Input
              label="Capacity"
              type="number"
              placeholder="16"
              value={form.capacity}
              onChange={(e) =>
                setForm((f) => ({ ...f, capacity: Number(e.target.value) }))
              }
            />
          </div>
          <Input
            label="Time"
            placeholder="Mon · 7:00 AM"
            value={form.time}
            onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
          />
          <Input
            label="Location"
            placeholder="Studio A"
            value={form.location}
            onChange={(e) =>
              setForm((f) => ({ ...f, location: e.target.value }))
            }
          />
          <Input
            label="Level"
            placeholder="Beginner"
            value={form.level}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                level: e.target.value as ClassItem["level"],
              }))
            }
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setOpenModal(false);
                setEditing(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editing ? "Save changes" : "Create class"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

