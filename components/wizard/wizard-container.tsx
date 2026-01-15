"use client";

import { useWizard } from "@/lib/wizard-context";
import { Step1Brief } from "./step-1-brief";
import { Step2Vibe } from "./step-2-vibe";
import { Step3Specs } from "./step-3-specs";
import { Step4Output } from "./step-4-output";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function WizardContainer() {
    const { step } = useWizard();

    const steps = [
        { number: 1, label: "Brief" },
        { number: 2, label: "Vibe" },
        { number: 3, label: "Specs" },
        { number: 4, label: "Output" },
    ];

    return (
        <div className="w-full max-w-6xl z-10 space-y-8">
            {/* Stepper Header */}
            <div className="flex justify-between items-center px-4 sm:px-12">
                {steps.map((s, idx) => (
                    <div key={s.number} className="flex flex-col items-center gap-2 relative">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2",
                            step >= s.number
                                ? "bg-indigo-500 border-indigo-500 text-white shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)]"
                                : "bg-zinc-900 border-zinc-800 text-zinc-500"
                        )}>
                            {s.number}
                        </div>
                        <span className={cn(
                            "text-xs font-medium uppercase tracking-wider transition-colors duration-300",
                            step >= s.number ? "text-indigo-400" : "text-zinc-600"
                        )}>
                            {s.label}
                        </span>
                        {/* Connector Line */}
                        {idx < steps.length - 1 && (
                            <div className={cn(
                                "absolute left-10 top-5 w-[calc(100vw/5)] sm:w-32 h-[2px] transition-colors duration-500",
                                step > s.number ? "bg-indigo-500/50" : "bg-zinc-900"
                            )} style={{ transform: "translateX(50%)", marginLeft: "10px" }} />
                        )}
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    style={{ willChange: "transform, opacity" }}
                >
                    {step === 1 && <Step1Brief />}
                    {step === 2 && <Step2Vibe />}
                    {step === 3 && <Step3Specs />}
                    {step === 4 && <Step4Output />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
