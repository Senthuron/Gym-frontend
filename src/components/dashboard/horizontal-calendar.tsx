"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const HorizontalCalendar = () => {
    const today = new Date();
    const currentDay = today.getDate();

    // Generate 5 days (2 before, today, 2 after)
    const days = [];
    for (let i = -2; i <= 2; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        days.push({
            dayName: date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2),
            dayNumber: date.getDate(),
            isToday: i === 0,
        });
    }

    return (
        <div className="w-full rounded-3xl bg-gradient-to-br from-gray-400 to-gray-500  p-5  text-white shadow-lg">
            <div className="flex justify-between items-center mb-6">
                {days.map((day, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "flex flex-col items-center justify-center transition-all duration-300",
                            day.isToday
                                ? "bg-white text-slate-900 rounded-full w-14 h-20 shadow-md scale-110"
                                : "opacity-80"
                        )}
                    >
                        <span className={cn(
                            "text-xs font-medium mb-1",
                            day.isToday ? "text-slate-400" : "text-white/80"
                        )}>
                            {day.dayName}
                        </span>
                        <span className="text-xl font-bold">
                            {day.dayNumber}
                        </span>
                    </div>
                ))}
            </div>

        </div>
    );
};
