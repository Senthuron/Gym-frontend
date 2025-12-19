"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { feedbackApi } from "@/lib/api";

interface FeedbackModalProps {
    open: boolean;
    onClose: () => void;
    type: 'TRAINER' | 'CLASS';
    trainerId?: string;
    classId?: string;
    title: string;
    onSuccess?: () => void;
}

export function FeedbackModal({
    open,
    onClose,
    type,
    trainerId,
    classId,
    title,
    onSuccess
}: FeedbackModalProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [suggestion, setSuggestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await feedbackApi.create({
                type,
                trainerId,
                classId,
                rating,
                comment,
                suggestion
            });

            if (response.success) {
                onSuccess?.();
                onClose();
                // Reset form
                setRating(0);
                setComment("");
                setSuggestion("");
            }
        } catch (err: any) {
            setError(err.message || "Failed to submit feedback");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            footer={
                <div className="flex gap-3">
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Submitting..." : "Submit Feedback"}
                    </Button>
                </div>
            }
        >
            <div className="space-y-6 py-2">
                {error && (
                    <div className="p-3 text-sm text-rose-600 bg-rose-50 rounded-lg border border-rose-100">
                        {error}
                    </div>
                )}

                <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none transition-transform hover:scale-110"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >
                                <Star
                                    className={`h-8 w-8 ${star <= (hover || rating)
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-slate-300"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Comment (Optional)</label>
                    <textarea
                        className="w-full min-h-[100px] rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="Tell us about your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Suggestion (Optional)</label>
                    <textarea
                        className="w-full min-h-[80px] rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="How can we improve?"
                        value={suggestion}
                        onChange={(e) => setSuggestion(e.target.value)}
                    />
                </div>
            </div>
        </Modal>
    );
}
