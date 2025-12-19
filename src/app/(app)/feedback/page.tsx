"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { feedbackApi, Feedback, FeedbackAnalytics } from "@/lib/api";
import { Star, Eye, EyeOff, BarChart3 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function FeedbackManagementPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [analytics, setAnalytics] = useState<FeedbackAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<'ALL' | 'TRAINER' | 'CLASS'>('ALL');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'HIDDEN'>('ALL');
    const [trainees, setTrainees] = useState<any[]>([]);
    const [filterTrainee, setFilterTrainee] = useState<string>('ALL');

    const loadData = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (filterType !== 'ALL') params.type = filterType;
            if (filterStatus !== 'ALL') params.status = filterStatus;
            if (filterTrainee !== 'ALL') params.traineeId = filterTrainee;

            const [feedbackRes, analyticsRes] = await Promise.all([
                feedbackApi.getAll(params),
                feedbackApi.getAnalytics()
            ]);

            if (feedbackRes.success && feedbackRes.data) {
                setFeedbacks(feedbackRes.data);
            }
            if (analyticsRes.success && analyticsRes.data) {
                setAnalytics(analyticsRes.data);
            }
        } catch (error) {
            console.error("Error loading feedback data:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadTrainees = async () => {
        try {
            const response = await membersApi.getAll(undefined, undefined, 'member');
            if (response.success && response.data) {
                setTrainees(response.data);
            }
        } catch (error) {
            console.error("Error loading trainees:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, [filterType, filterStatus, filterTrainee]);

    useEffect(() => {
        loadTrainees();
    }, []);

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
            const response = await feedbackApi.updateStatus(id, newStatus);
            if (response.success) {
                setFeedbacks(prev => prev.map(f => f._id === id ? { ...f, status: newStatus } : f));
            }
        } catch (error) {
            console.error("Error updating feedback status:", error);
        }
    };

    if (loading && feedbacks.length === 0) {
        return <div className="p-8 text-center text-slate-500">Loading feedback...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">Management</p>
                    <h1 className="text-3xl font-bold text-slate-900">Feedback & Ratings</h1>
                    <p className="text-slate-500">Monitor trainer performance and class quality.</p>
                </div>
            </div>

            {/* Analytics Section */}
            {analytics && (
                <div className="grid gap-6 md:grid-cols-2">
                    <Card padded={true} className="bg-white">
                        <h3 className="font-bold text-slate-900 mb-4">Trainer Performance</h3>
                        <div className="space-y-4">
                            {analytics.trainerStats.map((stat) => (
                                <div key={stat._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div>
                                        <p className="font-semibold text-slate-900">{stat.name}</p>
                                        <p className="text-xs text-slate-500">{stat.totalFeedback} reviews</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center text-amber-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="ml-1 font-bold text-slate-900">{stat.averageRating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {analytics.trainerStats.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No trainer ratings yet.</p>}
                        </div>
                    </Card>

                    <Card padded={true} className="bg-white">
                        <h3 className="font-bold text-slate-900 mb-4">Class Quality</h3>
                        <div className="space-y-4">
                            {analytics.classStats.map((stat) => (
                                <div key={stat._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div>
                                        <p className="font-semibold text-slate-900">{stat.name}</p>
                                        <p className="text-xs text-slate-500">{stat.totalFeedback} reviews</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center text-amber-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="ml-1 font-bold text-slate-900">{stat.averageRating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {analytics.classStats.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No class ratings yet.</p>}
                        </div>
                    </Card>
                </div>
            )}

            {/* Feedback List Section */}
            <Card padded={false} className="overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                    <h2 className="font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-emerald-600" />
                        Detailed Feedback
                    </h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={filterTrainee}
                            onChange={(e) => setFilterTrainee(e.target.value)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                        >
                            <option value="ALL">All Trainees</option>
                            {trainees.map(t => (
                                <option key={t._id} value={t._id}>{t.name}</option>
                            ))}
                        </select>
                        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                            {(['ALL', 'TRAINER', 'CLASS'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFilterType(t)}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filterType === t ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {t.charAt(0) + t.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                            {(['ALL', 'ACTIVE', 'HIDDEN'] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilterStatus(s)}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filterStatus === s ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {s.charAt(0) + s.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {feedbacks.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">No feedback found matching the criteria.</div>
                    ) : (
                        feedbacks.map((f) => (
                            <div key={f._id} className={`p-6 hover:bg-slate-50 transition-colors ${f.status === 'HIDDEN' ? 'opacity-60' : ''}`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${f.type === 'TRAINER' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                {f.type}
                                            </span>
                                            <div className="flex items-center text-amber-500">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} className={`h-3.5 w-3.5 ${s <= f.rating ? 'fill-current' : 'text-slate-200'}`} />
                                                ))}
                                            </div>
                                            <span className="text-xs text-slate-400">{formatDate(f.createdAt)}</span>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-slate-900">
                                                {f.type === 'TRAINER'
                                                    ? (typeof f.trainerId === 'object' ? (f.trainerId as any).name : 'Trainer')
                                                    : (typeof f.classId === 'object' ? (f.classId as any).name : 'Class')}
                                            </h4>
                                            <p className="text-xs text-slate-500">
                                                By: {typeof f.traineeId === 'object' ? (f.traineeId as any).name : 'Anonymous Trainee'}
                                            </p>
                                        </div>

                                        {f.comment && (
                                            <div className="bg-white p-3 rounded-xl border border-slate-100 text-sm text-slate-700 italic">
                                                "{f.comment}"
                                            </div>
                                        )}

                                        {f.suggestion && (
                                            <div className="text-sm text-slate-600">
                                                <span className="font-semibold text-slate-900">Suggestion: </span>
                                                {f.suggestion}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${f.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                            {f.status}
                                        </span>
                                        <button
                                            onClick={() => handleToggleStatus(f._id, f.status)}
                                            className={`p-2 rounded-xl transition-all ${f.status === 'ACTIVE' ? 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                            title={f.status === 'ACTIVE' ? 'Hide Feedback' : 'Show Feedback'}
                                        >
                                            {f.status === 'ACTIVE' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
