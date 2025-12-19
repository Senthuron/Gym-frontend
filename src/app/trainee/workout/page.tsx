"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { workoutPlansApi, WorkoutPlan } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Dumbbell, Calendar, Info, Clock } from "lucide-react";

export default function TraineeWorkoutPage() {
    const [plan, setPlan] = useState<WorkoutPlan | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPlan = async () => {
            try {
                const response = await workoutPlansApi.getAll();
                if (response.success && response.data && response.data.length > 0) {
                    // Get the latest plan
                    setPlan(response.data[0]);
                }
            } catch (error) {
                console.error("Error loading workout plan:", error);
            } finally {
                setLoading(false);
            }
        };
        loadPlan();
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Loading workout plan...</div>;
    }

    return (
        <div className="space-y-6 max-w-8xl mx-auto">
            <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider">Training</p>
                <h1 className="text-3xl font-bold text-slate-900">{plan?.title || "My Workout Plan"}</h1>
                <p className="text-slate-500">Follow your personalized weekly exercise schedule.</p>
            </div>

            {!plan || !plan.workoutDays || plan.workoutDays.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                    <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Dumbbell className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">No workout plan assigned yet</h3>
                    <p className="text-slate-500 mt-2">Your trainer hasn't uploaded your workout schedule. Please check back later or contact your trainer.</p>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {/* Plan Info */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Duration</p>
                                <p className="text-sm font-bold text-slate-900">{formatDate(plan.startDate)} - {formatDate(plan.endDate)}</p>
                            </div>
                        </Card>
                        <Card className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                <Dumbbell size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Difficulty</p>
                                <p className="text-sm font-bold text-slate-900">{plan.difficulty}</p>
                            </div>
                        </Card>
                        <Card className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Info size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Trainer</p>
                                <p className="text-sm font-bold text-slate-900">{typeof plan.trainerId === 'string' ? "Your Trainer" : plan.trainerId.name}</p>
                            </div>
                        </Card>
                    </div>

                    {/* Weekly Schedule */}
                    <div className="grid gap-6">
                        {plan.workoutDays.map((dayPlan, idx) => (
                            <Card key={idx} className="overflow-hidden border-slate-200">
                                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={18} className="text-slate-500" />
                                        <h2 className="font-bold text-slate-900">{dayPlan.dayName}</h2>
                                    </div>
                                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                        {dayPlan.focus}
                                    </span>
                                </div>
                                <div className="p-0 overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[600px]">
                                        <thead>
                                            <tr className="bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                <th className="px-6 py-3 border-b border-slate-100">Exercise</th>
                                                <th className="px-6 py-3 border-b border-slate-100">Sets</th>
                                                <th className="px-6 py-3 border-b border-slate-100">Reps</th>
                                                <th className="px-6 py-3 border-b border-slate-100">Rest</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {dayPlan.exercises.map((ex, exIdx) => (
                                                <tr key={exIdx} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-slate-900">{ex.name}</td>
                                                    <td className="px-6 py-4 text-slate-600">{ex.sets}</td>
                                                    <td className="px-6 py-4 text-slate-600">{ex.reps}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-500 italic">
                                                        <div className="flex items-center gap-1">
                                                            <Clock size={12} />
                                                            {ex.restTime || "—"}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
