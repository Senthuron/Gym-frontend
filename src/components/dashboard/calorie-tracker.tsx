"use client";

import React from "react";
import { Flame, TrendingUp, Utensils } from "lucide-react";

export const CalorieTracker = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <Flame className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Calories Burned</p>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-2xl font-bold text-slate-900">1,240</h3>
                        <span className="text-xs text-slate-400 font-medium">kcal</span>
                    </div>
                </div>
                <div className="ml-auto">
                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                        <TrendingUp className="h-3 w-3" />
                        +12%
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Utensils className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Calories Consumed</p>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-2xl font-bold text-slate-900">1,850</h3>
                        <span className="text-xs text-slate-400 font-medium">kcal</span>
                    </div>
                </div>
                <div className="ml-auto">
                    <div className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                        Goal: 2,200
                    </div>
                </div>
            </div>
        </div>
    );
};
