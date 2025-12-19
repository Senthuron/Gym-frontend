"use client";

import { useEffect, useState } from "react";
import { feedbackApi, Feedback } from "@/lib/api";
import { Star, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function TrainerFeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        averageRating: 0,
        totalReviews: 0
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const response = await feedbackApi.getAll({ type: 'TRAINER' });
                if (response.success && response.data) {
                    setFeedbacks(response.data);

                    const total = response.data.length;
                    if (total > 0) {
                        const sum = response.data.reduce((acc, f) => acc + f.rating, 0);
                        setStats({
                            averageRating: sum / total,
                            totalReviews: total
                        });
                    }
                }
            } catch (error) {
                console.error("Error loading trainer feedback:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading feedback...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-1">
                <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">Performance</p>
                <h1 className="text-3xl font-bold text-slate-900">Feedback Summary</h1>
                <p className="text-slate-500">View your ratings and anonymous feedback from trainees.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-amber-50 opacity-50 blur-2xl" />
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                            <Star className="h-6 w-6 fill-current" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Average Rating</p>
                            <h3 className="text-2xl font-bold text-slate-900">{stats.averageRating.toFixed(1)} / 5.0</h3>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-blue-50 opacity-50 blur-2xl" />
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Reviews</p>
                            <h3 className="text-2xl font-bold text-slate-900">{stats.totalReviews}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Recent Comments</h2>
                {feedbacks.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                        No feedback comments yet.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {feedbacks.map((f) => (
                            <div key={f._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-amber-500">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className={`h-4 w-4 ${s <= f.rating ? 'fill-current' : 'text-slate-200'}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-400">{formatDate(f.createdAt)}</span>
                                </div>

                                {f.comment ? (
                                    <p className="text-slate-700 italic">"{f.comment}"</p>
                                ) : (
                                    <p className="text-slate-400 italic text-sm">No comment provided.</p>
                                )}

                                <div className="pt-2 border-t border-slate-50 flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                        {(f.traineeId as any)?.name?.charAt(0) || 'A'}
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium">
                                        {(f.traineeId as any)?.name || 'Anonymous Trainee'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
