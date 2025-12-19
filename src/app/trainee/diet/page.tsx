"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { dietPlansApi, DietPlan } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Utensils, Clock, FileText, Info, Calendar } from "lucide-react";

export default function TraineeDietPage() {
    const [plan, setPlan] = useState<DietPlan | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPlan = async () => {
            try {
                const response = await dietPlansApi.getAll();
                if (response.success && response.data && response.data.length > 0) {
                    // Get the latest plan
                    setPlan(response.data[0]);
                }
            } catch (error) {
                console.error("Error loading diet plan:", error);
            } finally {
                setLoading(false);
            }
        };
        loadPlan();
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Loading diet plan...</div>;
    }

    return (
        <div className="space-y-6 max-w-8xl mx-auto">
            <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">Nutrition</p>
                <h1 className="text-3xl font-bold text-slate-900">{plan?.title || "My Diet Plan"}</h1>
                <p className="text-slate-500">Fuel your body with the right nutrition for your goals.</p>
            </div>

            {!plan || !plan.meals || plan.meals.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                    <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Utensils className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">No diet plan assigned yet</h3>
                    <p className="text-slate-500 mt-2">Your trainer hasn't uploaded your diet chart. Please check back later or contact your trainer.</p>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {/* Plan Info */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Duration</p>
                                <p className="text-sm font-bold text-slate-900">{formatDate(plan.startDate)} - {formatDate(plan.endDate)}</p>
                            </div>
                        </Card>
                        <Card className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <Utensils size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Goal Type</p>
                                <p className="text-sm font-bold text-slate-900">{plan.type.replace('_', ' ')}</p>
                            </div>
                        </Card>
                        <Card className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                <Info size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Trainer</p>
                                <p className="text-sm font-bold text-slate-900">{typeof plan.trainerId === 'string' ? "Your Trainer" : plan.trainerId.name}</p>
                            </div>
                        </Card>
                    </div>

                    {/* Nutrition Notes */}
                    {plan.notes && (
                        <Card className="p-6 bg-emerald-50 border-emerald-100">
                            <div className="flex gap-3">
                                <Info className="text-emerald-600 shrink-0" size={24} />
                                <div>
                                    <h3 className="font-semibold text-emerald-900">Nutrition Notes</h3>
                                    <p className="text-emerald-800 mt-1">{plan.notes}</p>
                                </div>
                            </div>
                        </Card>
                    )}

                    <div className="grid gap-6">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Clock size={20} className="text-slate-500" />
                            Meal Schedule
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {plan.meals.map((meal, idx) => (
                                <Card key={idx} className="p-5 border-slate-200 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-slate-900 text-lg">{meal.name}</h3>
                                        {meal.calories && (
                                            <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold">
                                                {meal.calories} kcal
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-3">{meal.description}</p>
                                    {meal.nutritionNotes && (
                                        <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500 italic">
                                            <Info size={14} className="shrink-0" />
                                            <span>{meal.nutritionNotes}</span>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
