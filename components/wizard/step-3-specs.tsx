"use client";

import React, { useState } from 'react';
import { useWizard } from "@/lib/wizard-context";
import { Terminal, Box, Play, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AISuggestions } from "@/lib/ai-suggestions";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Step3Specs() {
    const { data, setStep, updateSectionBlueprint } = useWizard();
    const [loadingSection, setLoadingSection] = useState<string | null>(null);
    const selectedSections = data.brief.sections.length > 0 ? data.brief.sections : ['Hero', 'Features', 'Footer'];

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold font-mono text-indigo-400 uppercase tracking-tighter flex items-center gap-2">
                    <Terminal className="w-6 h-6" /> 03. The Blueprint Scripter
                </h3>
                <p className="text-zinc-500 text-sm italic">Define specific DNA for each building block of your app.</p>
            </div>

            <Tabs defaultValue={selectedSections[0].toLowerCase()} className="w-full">
                <TabsList className="bg-zinc-900/50 border border-white/5 p-1 h-auto flex-wrap justify-start">
                    {selectedSections.map((section) => (
                        <TabsTrigger
                            key={section}
                            value={section.toLowerCase()}
                            className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white uppercase font-mono text-xs tracking-widest px-6 py-2 transition-all duration-300"
                        >
                            {section}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {selectedSections.map((section) => {
                    const spec = data.specs.sectionBlueprints[section] || { sourceCode: "", layoutPattern: "", animationSpec: "" };

                    return (
                        <TabsContent key={section} value={section.toLowerCase()} className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                {/* Main Technical Input: Code & DNA */}
                                <div className="lg:col-span-2 space-y-4">
                                    <Card className="bg-zinc-950 border-white/10 overflow-hidden shadow-2xl">
                                        <div className="bg-zinc-900/80 px-4 py-2 border-b border-white/10 flex justify-between items-center">
                                            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                                <Box className="w-3 h-3" /> Component Source Code (21st.dev / Prompt)
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-6 text-[10px] text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/30 font-bold px-2"
                                                    disabled={loadingSection === section}
                                                    onClick={async () => {
                                                        setLoadingSection(section);
                                                        const suggestion = await AISuggestions.specs.suggestBlueprint(section, data);
                                                        updateSectionBlueprint(section, {
                                                            sourceCode: suggestion.dna,
                                                            layoutPattern: suggestion.layout,
                                                            animationSpec: suggestion.motion,
                                                        });
                                                        setLoadingSection(null);
                                                    }}
                                                >
                                                    <Sparkles className={cn("w-3 h-3 mr-1", loadingSection === section && "animate-spin")} />
                                                    {loadingSection === section ? 'Think...' : 'Suggest DNA'}
                                                </Button>
                                                {spec.sourceCode && <CheckCircle2 className="w-3 h-3 text-indigo-400" />}
                                            </div>
                                        </div>
                                        <Textarea
                                            placeholder="Paste the raw .tsx code or the 21st.dev installation prompt here..."
                                            className="min-h-[400px] bg-transparent border-none focus-visible:ring-0 font-mono text-sm leading-relaxed text-indigo-100/80 p-6 resize-none"
                                            value={spec.sourceCode}
                                            onChange={(e) => updateSectionBlueprint(section, { sourceCode: e.target.value })}
                                        />
                                    </Card>
                                </div>

                                {/* Side Parameters: Patterns & Motion */}
                                <div className="space-y-4">
                                    <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl backdrop-blur-sm">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Play className="w-4 h-4 text-indigo-400" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Layout & Motion</span>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Layout Pattern</label>
                                                <input
                                                    className="w-full bg-zinc-900 border border-white/5 rounded-lg p-3 text-sm mt-1 focus:border-indigo-500/50 outline-none transition-all text-zinc-200"
                                                    placeholder="e.g. Bento Grid"
                                                    value={spec.layoutPattern}
                                                    onChange={(e) => updateSectionBlueprint(section, { layoutPattern: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Animation Spec</label>
                                                <textarea
                                                    className="w-full bg-zinc-900 border border-white/5 rounded-lg p-3 text-sm mt-1 focus:border-indigo-500/50 outline-none min-h-[120px] transition-all text-zinc-200 resize-none"
                                                    placeholder="e.g. Scroll-triggered reveal"
                                                    value={spec.animationSpec}
                                                    onChange={(e) => updateSectionBlueprint(section, { animationSpec: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 border border-zinc-800/50 rounded-xl bg-zinc-900/40 backdrop-blur-sm">
                                        <div className="flex items-center gap-2 mb-3">
                                            <AlertCircle className="w-3 h-3 text-zinc-500" />
                                            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Dependency Scan</span>
                                        </div>
                                        <p className="text-[10px] text-zinc-600 italic leading-relaxed">
                                            SpecForge will automatically scan the code snippet above to inject required packages into your `tasks.md`.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </TabsContent>
                    );
                })}
            </Tabs>

            {/* Navigation Footer */}
            <div className="pt-8 flex justify-between border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(2)} className="hover:bg-zinc-800 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Vibe
                </Button>
                <Button onClick={() => setStep(4)} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] transition-all hover:scale-105">
                    Go to Build Output <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
