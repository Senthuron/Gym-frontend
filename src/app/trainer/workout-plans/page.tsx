"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { workoutPlansApi, membersApi, Member, WorkoutPlan } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Plus, Search, Dumbbell, Trash2, Edit2, Calendar, Clock } from "lucide-react";

export default function TrainerWorkoutPlansPage() {
    const [plans, setPlans] = useState<WorkoutPlan[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);

    const [form, setForm] = useState({
        title: "",
        difficulty: "BEGINNER" as WorkoutPlan["difficulty"],
        traineeId: "",
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        workoutDays: [
            { dayName: "Monday", focus: "Chest & Triceps", exercises: [{ name: "", sets: "3", reps: "12", restTime: "60s" }] },
        ],
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [plansRes, membersRes] = await Promise.all([
                workoutPlansApi.getAll(),
                membersApi.getAll(),
            ]);
            if (plansRes.success) setPlans(plansRes.data || []);
            if (membersRes.success) {
                setMembers((membersRes.data || []).filter(m => m.role === 'member'));
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (!form.title || !form.traineeId) {
                alert("Please fill in all required fields");
                return;
            }

            const payload = {
                ...form,
                workoutDays: form.workoutDays.filter(d => d.exercises.some(ex => ex.name.trim() !== "")),
            };

            let res;
            if (editingPlan) {
                res = await workoutPlansApi.update(editingPlan._id, payload);
            } else {
                res = await workoutPlansApi.create(payload);
            }

            if (res.success) {
                setIsModalOpen(false);
                setEditingPlan(null);
                resetForm();
                loadData();
            }
        } catch (error) {
            console.error("Error saving plan:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this plan?")) return;
        try {
            const res = await workoutPlansApi.delete(id);
            if (res.success) loadData();
        } catch (error) {
            console.error("Error deleting plan:", error);
        }
    };

    const resetForm = () => {
        setForm({
            title: "",
            difficulty: "BEGINNER",
            traineeId: "",
            startDate: new Date().toISOString().slice(0, 10),
            endDate: new Date().toISOString().slice(0, 10),
            workoutDays: [
                { dayName: "Monday", focus: "Chest & Triceps", exercises: [{ name: "", sets: "3", reps: "12", restTime: "60s" }] },
            ],
        });
    };

    const startEdit = (plan: WorkoutPlan) => {
        setEditingPlan(plan);
        setForm({
            title: plan.title,
            difficulty: plan.difficulty,
            traineeId: typeof plan.traineeId === 'string' ? plan.traineeId : plan.traineeId._id,
            startDate: new Date(plan.startDate).toISOString().slice(0, 10),
            endDate: new Date(plan.endDate).toISOString().slice(0, 10),
            workoutDays: plan.workoutDays.length > 0 ? plan.workoutDays : [
                { dayName: "Monday", focus: "Chest & Triceps", exercises: [{ name: "", sets: "3", reps: "12", restTime: "60s" }] },
            ],
        });
        setIsModalOpen(true);
    };

    const filteredPlans = plans.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (typeof p.traineeId !== 'string' && p.traineeId.name.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Workout Plan Management</h1>
                    <p className="text-slate-500 text-sm">Design and assign workout routines to your trainees.</p>
                </div>
                <Button onClick={() => { resetForm(); setEditingPlan(null); setIsModalOpen(true); }}>
                    <Plus size={18} className="mr-2" /> Create New Plan
                </Button>
            </div>

            <Card className="p-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        placeholder="Search plans or trainees..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-slate-500">Loading plans...</div>
                ) : filteredPlans.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500">No workout plans found.</div>
                ) : (
                    filteredPlans.map((plan) => (
                        <Card key={plan._id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-5 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase tracking-wider">
                                            {plan.difficulty}
                                        </span>
                                        <h3 className="font-bold text-slate-900 line-clamp-1">{plan.title}</h3>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => startEdit(plan)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(plan._id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Dumbbell size={14} />
                                        <span>Trainee: <span className="font-semibold text-slate-900">{typeof plan.traineeId === 'string' ? plan.traineeId : plan.traineeId.name}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Calendar size={14} />
                                        <span>{formatDate(plan.startDate)} - {formatDate(plan.endDate)}</span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-xs text-slate-400">{plan.workoutDays.length} days scheduled</span>
                                    <Button variant="ghost" size="sm" onClick={() => startEdit(plan)}>View Details</Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPlan ? "Edit Workout Plan" : "Create Workout Plan"}
                className="max-w-4xl"
            >
                <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input
                            label="Plan Title"
                            placeholder="e.g. Hypertrophy Phase 1"
                            value={form.title}
                            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                            required
                        />
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty</label>
                            <select
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                value={form.difficulty}
                                onChange={(e) => setForm(f => ({ ...f, difficulty: e.target.value as any }))}
                            >
                                <option value="BEGINNER">Beginner</option>
                                <option value="INTERMEDIATE">Intermediate</option>
                                <option value="ADVANCED">Advanced</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Assign Trainee</label>
                            <select
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                value={form.traineeId}
                                onChange={(e) => setForm(f => ({ ...f, traineeId: e.target.value }))}
                                required
                            >
                                <option value="">Select a trainee</option>
                                {members.map(m => (
                                    <option key={m._id} value={m.user && typeof m.user !== 'string' ? m.user._id : (m as any).user}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                label="Start Date"
                                type="date"
                                value={form.startDate}
                                onChange={(e) => setForm(f => ({ ...f, startDate: e.target.value }))}
                            />
                            <Input
                                label="End Date"
                                type="date"
                                value={form.endDate}
                                onChange={(e) => setForm(f => ({ ...f, endDate: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="font-bold text-slate-900">Workout Schedule</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setForm(f => ({
                                    ...f,
                                    workoutDays: [...f.workoutDays, { dayName: "New Day", focus: "", exercises: [{ name: "", sets: "3", reps: "12", restTime: "60s" }] }]
                                }))}
                            >
                                + Add Day
                            </Button>
                        </div>

                        {form.workoutDays.map((day, dayIdx) => (
                            <div key={dayIdx} className="p-5 border border-slate-200 rounded-2xl space-y-4 bg-slate-50/30">
                                <div className="flex gap-4 items-start">
                                    <div className="flex-1 grid gap-4 md:grid-cols-2">
                                        <Input
                                            placeholder="Day Name (e.g. Monday)"
                                            value={day.dayName}
                                            onChange={(e) => {
                                                const newDays = [...form.workoutDays];
                                                newDays[dayIdx].dayName = e.target.value;
                                                setForm(f => ({ ...f, workoutDays: newDays }));
                                            }}
                                        />
                                        <Input
                                            placeholder="Focus (e.g. Chest & Back)"
                                            value={day.focus}
                                            onChange={(e) => {
                                                const newDays = [...form.workoutDays];
                                                newDays[dayIdx].focus = e.target.value;
                                                setForm(f => ({ ...f, workoutDays: newDays }));
                                            }}
                                        />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500"
                                        onClick={() => {
                                            const newDays = form.workoutDays.filter((_, i) => i !== dayIdx);
                                            setForm(f => ({ ...f, workoutDays: newDays }));
                                        }}
                                    >
                                        Remove Day
                                    </Button>
                                </div>

                                <div className="space-y-3 pl-4 border-l-2 border-slate-200">
                                    <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-500 uppercase px-2">
                                        <div className="col-span-5">Exercise</div>
                                        <div className="col-span-2">Sets</div>
                                        <div className="col-span-2">Reps</div>
                                        <div className="col-span-2">Rest</div>
                                        <div className="col-span-1"></div>
                                    </div>
                                    {day.exercises.map((ex, exIdx) => (
                                        <div key={exIdx} className="grid grid-cols-12 gap-2 items-center">
                                            <div className="col-span-5">
                                                <Input
                                                    placeholder="Exercise name"
                                                    className="bg-white"
                                                    value={ex.name}
                                                    onChange={(e) => {
                                                        const newDays = [...form.workoutDays];
                                                        newDays[dayIdx].exercises[exIdx].name = e.target.value;
                                                        setForm(f => ({ ...f, workoutDays: newDays }));
                                                    }}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <Input
                                                    placeholder="Sets"
                                                    className="bg-white"
                                                    value={ex.sets}
                                                    onChange={(e) => {
                                                        const newDays = [...form.workoutDays];
                                                        newDays[dayIdx].exercises[exIdx].sets = e.target.value;
                                                        setForm(f => ({ ...f, workoutDays: newDays }));
                                                    }}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <Input
                                                    placeholder="Reps"
                                                    className="bg-white"
                                                    value={ex.reps}
                                                    onChange={(e) => {
                                                        const newDays = [...form.workoutDays];
                                                        newDays[dayIdx].exercises[exIdx].reps = e.target.value;
                                                        setForm(f => ({ ...f, workoutDays: newDays }));
                                                    }}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <Input
                                                    placeholder="Rest"
                                                    className="bg-white"
                                                    value={ex.restTime}
                                                    onChange={(e) => {
                                                        const newDays = [...form.workoutDays];
                                                        newDays[dayIdx].exercises[exIdx].restTime = e.target.value;
                                                        setForm(f => ({ ...f, workoutDays: newDays }));
                                                    }}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <button
                                                    onClick={() => {
                                                        const newDays = [...form.workoutDays];
                                                        newDays[dayIdx].exercises = newDays[dayIdx].exercises.filter((_, i) => i !== exIdx);
                                                        setForm(f => ({ ...f, workoutDays: newDays }));
                                                    }}
                                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-blue-600 hover:bg-blue-50"
                                        onClick={() => {
                                            const newDays = [...form.workoutDays];
                                            newDays[dayIdx].exercises.push({ name: "", sets: "3", reps: "12", restTime: "60s" });
                                            setForm(f => ({ ...f, workoutDays: newDays }));
                                        }}
                                    >
                                        + Add Exercise
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>{editingPlan ? "Update Plan" : "Create & Assign Plan"}</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
