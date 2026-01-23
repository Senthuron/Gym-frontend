"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const HorizontalCalendar = () => {
    const today = new Date();

    // Generate 5 days (2 before, today, 2 after)
    const days = [];
    for (let i = -2; i <= 2; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        days.push({
            dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
            dayNumber: date.getDate(),
            isToday: i === 0,
        });
    }

    return (
        <div className="w-full space-y-4">
            <div className="grid grid-cols-5 gap-4 sm:gap-4">
                {days.map((day, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-300 shadow-sm",
                            day.isToday
                                ? "bg-blue-500 text-white shadow-blue-200 shadow-lg scale-105 z-10"
                                : "bg-slate-50 text-slate-600 border border-slate-100"
                        )}
                    >
                        <span className={cn(
                            "text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-1",
                            day.isToday ? "text-white/90" : "text-slate-400"
                        )}>
                            {day.dayName}
                        </span>
                        <span className="text-base sm:text-xl font-extrabold">
                            {day.dayNumber}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
