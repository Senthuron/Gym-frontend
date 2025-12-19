"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { dietPlansApi, membersApi, Member, DietPlan } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Plus, Search, Utensils, Trash2, Edit2, Calendar } from "lucide-react";

export default function TrainerDietPlansPage() {
    const [plans, setPlans] = useState<DietPlan[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<DietPlan | null>(null);

    const [form, setForm] = useState({
        title: "",
        type: "WEIGHT_LOSS" as DietPlan["type"],
        traineeId: "",
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        notes: "",
        meals: [
            { name: "Breakfast", description: "", calories: 0, nutritionNotes: "" },
            { name: "Lunch", description: "", calories: 0, nutritionNotes: "" },
            { name: "Dinner", description: "", calories: 0, nutritionNotes: "" },
        ],
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [plansRes, membersRes] = await Promise.all([
                dietPlansApi.getAll(),
                membersApi.getAll(),
            ]);
            if (plansRes.success) setPlans(plansRes.data || []);
            if (membersRes.success) {
                // Filter only trainees
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
                meals: form.meals.filter(m => m.description.trim() !== ""),
            };

            let res;
            if (editingPlan) {
                res = await dietPlansApi.update(editingPlan._id, payload);
            } else {
                res = await dietPlansApi.create(payload);
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
            const res = await dietPlansApi.delete(id);
            if (res.success) loadData();
        } catch (error) {
            console.error("Error deleting plan:", error);
        }
    };

    const resetForm = () => {
        setForm({
            title: "",
            type: "WEIGHT_LOSS",
            traineeId: "",
            startDate: new Date().toISOString().slice(0, 10),
            endDate: new Date().toISOString().slice(0, 10),
            notes: "",
            meals: [
                { name: "Breakfast", description: "", calories: 0, nutritionNotes: "" },
                { name: "Lunch", description: "", calories: 0, nutritionNotes: "" },
                { name: "Dinner", description: "", calories: 0, nutritionNotes: "" },
            ],
        });
    };

    const startEdit = (plan: DietPlan) => {
        setEditingPlan(plan);
        setForm({
            title: plan.title,
            type: plan.type,
            traineeId: typeof plan.traineeId === 'string' ? plan.traineeId : plan.traineeId._id,
            startDate: new Date(plan.startDate).toISOString().slice(0, 10),
            endDate: new Date(plan.endDate).toISOString().slice(0, 10),
            notes: plan.notes || "",
            meals: plan.meals.length > 0 ? plan.meals : [
                { name: "Breakfast", description: "", calories: 0, nutritionNotes: "" },
                { name: "Lunch", description: "", calories: 0, nutritionNotes: "" },
                { name: "Dinner", description: "", calories: 0, nutritionNotes: "" },
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
                    <h1 className="text-2xl font-bold text-slate-900">Diet Plan Management</h1>
                    <p className="text-slate-500 text-sm">Create and assign nutrition plans to your trainees.</p>
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
                    <div className="col-span-full text-center py-12 text-slate-500">No diet plans found.</div>
                ) : (
                    filteredPlans.map((plan) => (
                        <Card key={plan._id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-5 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold uppercase tracking-wider">
                                            {plan.type.replace('_', ' ')}
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
                                        <Utensils size={14} />
                                        <span>Trainee: <span className="font-semibold text-slate-900">{typeof plan.traineeId === 'string' ? plan.traineeId : plan.traineeId.name}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Calendar size={14} />
                                        <span>{formatDate(plan.startDate)} - {formatDate(plan.endDate)}</span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-xs text-slate-400">{plan.meals.length} meals defined</span>
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
                title={editingPlan ? "Edit Diet Plan" : "Create Diet Plan"}
                className="max-w-3xl"
            >
                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input
                            label="Plan Title"
                            placeholder="e.g. 30 Day Weight Loss"
                            value={form.title}
                            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                            required
                        />
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Plan Type</label>
                            <select
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                value={form.type}
                                onChange={(e) => setForm(f => ({ ...f, type: e.target.value as any }))}
                            >
                                <option value="WEIGHT_LOSS">Weight Loss</option>
                                <option value="WEIGHT_GAIN">Weight Gain</option>
                                <option value="MUSCLE_BUILD">Muscle Build</option>
                                <option value="MAINTENANCE">Maintenance</option>
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

                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-900 border-b pb-2">Meal Structure</h3>
                        {form.meals.map((meal, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-xl space-y-3">
                                <div className="flex justify-between items-center">
                                    <Input
                                        placeholder="Meal Name (e.g. Breakfast)"
                                        className="max-w-[200px] bg-white"
                                        value={meal.name}
                                        onChange={(e) => {
                                            const newMeals = [...form.meals];
                                            newMeals[idx].name = e.target.value;
                                            setForm(f => ({ ...f, meals: newMeals }));
                                        }}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-600"
                                        onClick={() => {
                                            const newMeals = form.meals.filter((_, i) => i !== idx);
                                            setForm(f => ({ ...f, meals: newMeals }));
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                                <textarea
                                    placeholder="What should they eat?"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[80px]"
                                    value={meal.description}
                                    onChange={(e) => {
                                        const newMeals = [...form.meals];
                                        newMeals[idx].description = e.target.value;
                                        setForm(f => ({ ...f, meals: newMeals }));
                                    }}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        placeholder="Calories (optional)"
                                        type="number"
                                        value={meal.calories || ""}
                                        onChange={(e) => {
                                            const newMeals = [...form.meals];
                                            newMeals[idx].calories = parseInt(e.target.value) || 0;
                                            setForm(f => ({ ...f, meals: newMeals }));
                                        }}
                                    />
                                    <Input
                                        placeholder="Nutrition Notes"
                                        value={meal.nutritionNotes || ""}
                                        onChange={(e) => {
                                            const newMeals = [...form.meals];
                                            newMeals[idx].nutritionNotes = e.target.value;
                                            setForm(f => ({ ...f, meals: newMeals }));
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => setForm(f => ({
                                ...f,
                                meals: [...f.meals, { name: "New Meal", description: "", calories: 0, nutritionNotes: "" }]
                            }))}
                        >
                            + Add Another Meal
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">General Notes</label>
                        <textarea
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[100px]"
                            placeholder="Any additional instructions..."
                            value={form.notes}
                            onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                        />
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
