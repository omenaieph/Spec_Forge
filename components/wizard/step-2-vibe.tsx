"use client";

import React, { useState, useRef } from 'react';
import { useWizard } from "@/lib/wizard-context";
import { Upload, Sparkles, Type, Palette, Layers, Globe, X, ArrowLeft, ArrowRight, MousePointer2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AISuggestions } from "@/lib/ai-suggestions";

export function Step2Vibe() {
    const { data, updateVibe, setStep } = useWizard();
    const [customKeyword, setCustomKeyword] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSuggest = async () => {
        if (!data.brief.description) return;
        const suggestions = await AISuggestions.vibe.suggestStyle(data.brief.description, data.brief.projectType);
        updateVibe({
            keywords: suggestions.keywords,
            accent: suggestions.accent,
            secondary: suggestions.secondary,
            fonts: suggestions.fonts,
            effects: suggestions.effects,
        });
    };

    const addKeyword = (tag: string) => {
        if (!tag.trim()) return;
        if (data.vibe.keywords.includes(tag.trim())) return;
        updateVibe({ keywords: [...data.vibe.keywords, tag.trim()] });
    };

    const removeKeyword = (tag: string) => {
        updateVibe({ keywords: data.vibe.keywords.filter(k => k !== tag) });
    };

    const toggleEffect = (effect: string) => {
        if (data.vibe.effects.includes(effect)) {
            updateVibe({ effects: data.vibe.effects.filter(e => e !== effect) });
        } else {
            updateVibe({ effects: [...data.vibe.effects, effect] });
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Mock upload - just adding filenames to state
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map(f => f.name);
            updateVibe({ uploadedFiles: [...data.vibe.uploadedFiles, ...newFiles] });
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20">

            {/* 01. MOOD & VISUAL EVIDENCE */}
            <section className="space-y-6 animate-in slide-in-from-bottom-5 fade-in duration-500">
                <div className="flex items-center gap-2 mb-2">
                    <div className="bg-indigo-500/10 p-2 rounded-lg">
                        <Globe className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold font-mono uppercase tracking-tight text-zinc-100">01. Mood & Evidence</h3>
                        <p className="text-zinc-500 text-sm">Upload references and define the aesthetic vocabulary.</p>
                    </div>
                </div>

                {/* Screenshot Dropzone */}
                <div
                    className="border-2 border-dashed border-zinc-800 rounded-xl p-10 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-indigo-500/30 transition-all flex flex-col items-center justify-center group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                    />
                    <Upload className="w-10 h-10 text-zinc-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-300 mb-4" />
                    <p className="text-zinc-400 text-sm font-medium">Click or Drag & drop screenshots of 3-5 reference sites</p>
                    <span className="text-zinc-600 text-xs mt-2 italic flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI will analyze these for color & type extraction
                    </span>

                    {data.vibe.uploadedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-6 justify-center max-w-lg">
                            {data.vibe.uploadedFiles.map((f, i) => (
                                <Badge key={i} variant="outline" className="text-xs border-zinc-700 bg-zinc-900/50">
                                    {f}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Keyword Lab */}
                <div className="space-y-3">
                    <Label className="text-zinc-400">Aesthetic Keywords</Label>
                    <div className="flex flex-wrap gap-2 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg min-h-[50px] items-center">
                        {data.vibe.keywords.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 px-3 py-1 cursor-pointer hover:bg-indigo-500/20 transition-colors" onClick={() => removeKeyword(tag)}>
                                {tag} <X className="w-3 h-3 ml-2 opacity-50" />
                            </Badge>
                        ))}
                        <input
                            value={customKeyword}
                            onChange={(e) => setCustomKeyword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addKeyword(customKeyword);
                                    setCustomKeyword("");
                                }
                            }}
                            placeholder={data.vibe.keywords.length === 0 ? "Add keywords (e.g. Modern, Sleek)..." : "Add..."}
                            className="bg-transparent border-none outline-none text-sm text-zinc-300 placeholder:text-zinc-600 ml-2 flex-1 min-w-[150px]"
                        />
                    </div>
                    <button
                        onClick={handleSuggest}
                        className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors pt-1"
                        disabled={!data.brief.description}
                    >
                        <Sparkles className="w-3 h-3" /> Suggest keywords based on project brief
                    </button>
                </div>
            </section>

            {/* 02. VISUALS & TEXTURE */}
            <section className="space-y-6 animate-in slide-in-from-bottom-5 fade-in duration-500 delay-100">
                <div className="flex items-center gap-2 mb-2">
                    <div className="bg-indigo-500/10 p-2 rounded-lg">
                        <Palette className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold font-mono uppercase tracking-tight text-zinc-100">02. Visual Architecture</h3>
                        <p className="text-zinc-500 text-sm">Define color theory and surface treatments.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Color & Theme */}
                    <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-md">
                        <CardContent className="p-6 space-y-4">
                            <Label className="text-zinc-400">Theme & Accent</Label>
                            <div className="flex gap-4">
                                {/* Theme Toggles */}
                                <div
                                    onClick={() => updateVibe({ theme: "dark" })}
                                    className={`h-16 flex-1 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${data.vibe.theme === 'dark' ? 'border-indigo-500 bg-zinc-950' : 'border-zinc-800 bg-zinc-950 opacity-50 hover:opacity-100'}`}
                                >
                                    <span className="text-xs font-bold text-white">Dark</span>
                                </div>
                                <div
                                    onClick={() => updateVibe({ theme: "light" })}
                                    className={`h-16 flex-1 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${data.vibe.theme === 'light' ? 'border-indigo-500 bg-slate-50' : 'border-zinc-800 bg-slate-50 opacity-50 hover:opacity-100'}`}
                                >
                                    <span className="text-xs font-bold text-zinc-900">Light</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-zinc-500 uppercase">Primary Accent</Label>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-lg border border-white/10 shadow-[0_0_15px_-3px_var(--shadow-color)] transition-all"
                                            style={{ backgroundColor: data.vibe.accent, '--shadow-color': data.vibe.accent } as React.CSSProperties}
                                        />
                                        <Input
                                            placeholder="#hexcode"
                                            className="bg-zinc-950/50 border-zinc-800 font-mono text-indigo-300"
                                            value={data.vibe.accent}
                                            onChange={(e) => updateVibe({ accent: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-zinc-500 uppercase">Secondary Accent</Label>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-lg border border-white/10 shadow-[0_0_15px_-3px_var(--shadow-color)] transition-all"
                                            style={{ backgroundColor: data.vibe.secondary, '--shadow-color': data.vibe.secondary } as React.CSSProperties}
                                        />
                                        <Input
                                            placeholder="#hexcode"
                                            className="bg-zinc-950/50 border-zinc-800 font-mono text-purple-300"
                                            value={data.vibe.secondary}
                                            onChange={(e) => updateVibe({ secondary: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Effects Grid */}
                    <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-md">
                        <CardContent className="p-6 space-y-4">
                            <Label className="text-zinc-400 text-xs uppercase tracking-widest">Texture & Effects</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Noise/Grain', 'Glassmorphism', 'Radial Glows', 'Bento Grid', 'Dot Pattern', 'Gradient Mesh'].map((effect) => (
                                    <div
                                        key={effect}
                                        onClick={() => toggleEffect(effect)}
                                        className={`flex items-center gap-2 p-2 rounded border transition-all cursor-pointer group select-none ${data.vibe.effects.includes(effect) ? 'bg-indigo-500/10 border-indigo-500/50' : 'border-zinc-800 hover:border-zinc-700'}`}
                                    >
                                        <div className={`w-3 h-3 rounded-full border transition-colors ${data.vibe.effects.includes(effect) ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-600 bg-transparent'}`} />
                                        <span className={`text-xs ${data.vibe.effects.includes(effect) ? 'text-indigo-200' : 'text-zinc-400'}`}>{effect}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* 03. TYPOGRAPHY LAB */}
            <section className="space-y-6 animate-in slide-in-from-bottom-5 fade-in duration-500 delay-200">
                <div className="flex items-center gap-2 mb-2">
                    <div className="bg-indigo-500/10 p-2 rounded-lg">
                        <Type className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold font-mono uppercase tracking-tight text-zinc-100">03. Typography Lab</h3>
                        <p className="text-zinc-500 text-sm">Select fonts for hierarchy levels.</p>
                    </div>
                </div>

                <div className="space-y-4 bg-zinc-900/40 border border-white/5 p-6 rounded-xl backdrop-blur-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-500 uppercase">Headlines</Label>
                            <Input
                                placeholder="e.g. Satoshi"
                                className="bg-zinc-950/50 border-zinc-800 text-zinc-200"
                                value={data.vibe.fonts.heading}
                                onChange={(e) => updateVibe({ fonts: { ...data.vibe.fonts, heading: e.target.value } })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-500 uppercase">Body</Label>
                            <Input
                                placeholder="e.g. Inter"
                                className="bg-zinc-950/50 border-zinc-800 text-zinc-200"
                                value={data.vibe.fonts.body}
                                onChange={(e) => updateVibe({ fonts: { ...data.vibe.fonts, body: e.target.value } })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-500 uppercase">Accent/Mono</Label>
                            <Input
                                placeholder="e.g. JetBrains Mono"
                                className="bg-zinc-950/50 border-zinc-800 text-zinc-200"
                                value={data.vibe.fonts.mono}
                                onChange={(e) => updateVibe({ fonts: { ...data.vibe.fonts, mono: e.target.value } })}
                            />
                        </div>
                    </div>
                    {/* Typography Preview - Dynamic */}
                    <div className="mt-6 p-6 bg-zinc-950/50 rounded border border-zinc-800 text-center transition-all duration-300">
                        <h4 className="text-2xl mb-2 font-bold" style={{ fontFamily: data.vibe.fonts.heading || 'inherit' }}>
                            The Quick Brown Fox
                        </h4>
                        <p className="text-zinc-400 mb-4" style={{ fontFamily: data.vibe.fonts.body || 'inherit' }}>
                            Jumps over the lazy dog. A sophisticated visual experience.
                        </p>
                        <div className="inline-block px-3 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs border border-indigo-500/20" style={{ fontFamily: data.vibe.fonts.mono || 'inherit' }}>
                            import {'{ SpecForge }'} from 'future';
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation Footer */}
            <div className="pt-4 flex justify-between border-t border-white/5 mt-8 pt-8">
                <Button variant="ghost" onClick={() => setStep(1)} className="hover:bg-zinc-800 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={() => setStep(3)} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] transition-all hover:scale-105">
                    Next: The Specs <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
