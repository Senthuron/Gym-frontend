"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

interface OnboardingProps {
    onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white p-6 animate-in fade-in duration-500">
            <div className="w-full max-w-md space-y-8 text-center">
                {/* Illustration */}
                <div className="relative aspect-square w-full overflow-hidden rounded-3xl">
                    <Image
                        src="/onboarding-illustration.png"
                        alt="Fitness Illustration"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Lets Improve your Health & Fitness
                    </h1>
                    <p className="text-slate-500 leading-relaxed">
                        Start your fitness journey with daily workouts, smart tracking, and expert guidance designed to keep you strong, active, and consistent.
                    </p>
                </div>

                {/* Action */}
                <div className="pt-8">
                    <Button
                        onClick={onComplete}
                        size="lg"
                        className="w-full h-14 rounded-2xl bg-blue-600 text-lg font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                    >
                        Get Started
                    </Button>
                </div>
            </div>
        </div>
    );
}
