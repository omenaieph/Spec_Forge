"use client";

import React, { useState } from 'react';
import { useWizard } from "@/lib/wizard-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AISuggestions } from "@/lib/ai-suggestions";
import { Sparkles, ArrowRight, X, ListTree, MessageSquarePlus, Terminal, Globe, Layout, AppWindow, Smartphone, ShoppingBag, Server, Store, Users, Bot, Feather, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const PROJECT_TYPES = [
    { id: "marketing", label: "Marketing Website", icon: Globe, desc: "Landing Pages, Portfolios", defaultSections: ["Hero", "Features", "Pricing", "Testimonials", "FAQ", "Footer", "About", "Contact"] },
    { id: "saas", label: "SaaS Application", icon: LayoutDashboard, desc: "Productivity, Tools", defaultSections: ["Onboarding", "Dashboard", "Projects", "Analytics", "Settings", "Billing", "Team"] },
    { id: "ecommerce", label: "E-Commerce", icon: ShoppingBag, desc: "Online Store, Shopify", defaultSections: ["Hero", "Featured Products", "Collections", "Product Grid", "Cart", "Checkout", "Account"] },
    { id: "marketplace", label: "Marketplace", icon: Store, desc: "Two-sided, Listings", defaultSections: ["Search Hero", "Categories", "Featured Listings", "Map View", "Vendor Profile", "Booking Flow"] },
    { id: "social", label: "Social Platform", icon: Users, desc: "Community, Feed", defaultSections: ["Feed", "Create Post", "User Profile", "Comments", "Notifications", "Messaging", "Explore"] },
    { id: "ai", label: "AI Tool / Wrapper", icon: Bot, desc: "GenAI, LLM Interface", defaultSections: ["Prompt Input", "Chat Interface", "Result Display", "History", "Templates", "Settings"] },
    { id: "dashboard", label: "Admin Dashboard", icon: AppWindow, desc: "Internal Tools, CRM", defaultSections: ["Overview Stats", "Data Tables", "Filters", "User Management", "Reports", "Logs"] },
    { id: "mobile", label: "Mobile App", icon: Smartphone, desc: "iOS, Android Native", defaultSections: ["Splash", "Onboarding", "Tab Navigation", "Feed", "Profile", "Settings"] },
    { id: "content", label: "Content / Blog", icon: Feather, desc: "News, Media, Wiki", defaultSections: ["Featured Article", "Latest Posts", "Categories", "Author Profile", "Article View", "Newsletter"] },
    { id: "backend", label: "Backend / API", icon: Server, desc: "Infrastructure, CLI", defaultSections: ["API Reference", "Auth Patterns", "Endpoints", "Database Schema", "Architecture", "Errors"] }
];

const DEFAULT_SECTIONS = ["Hero", "Features", "Pricing", "Testimonials", "FAQ", "Footer", "About", "Contact", "Blog", "Docs"];

export function Step1Brief() {
    const { data, updateBrief, setStep } = useWizard();
    const [newSection, setNewSection] = useState("");
    const [newSectionContext, setNewSectionContext] = useState("");
    const [isRefining, setIsRefining] = useState(false);
    const [isLoadingRefinement, setIsLoadingRefinement] = useState(false);
    const [refinementQuestions, setRefinementQuestions] = useState<string[]>([]);
    const [strategyTip, setStrategyTip] = useState("");

    const handleSuggest = () => {
        if (!data.brief.description) return;
        const suggestions = AISuggestions.brief.suggestStats(data.brief.description, data.brief.projectType);
        updateBrief({
            audience: suggestions.audience,
            sections: suggestions.sections,
        });
    };

    const handleAddCustomSection = () => {
        if (newSection && !data.brief.sections.includes(newSection)) {
            updateBrief({
                sections: [...data.brief.sections, newSection],
                sectionContext: { ...data.brief.sectionContext, [newSection]: newSectionContext }
            });
            setNewSection("");
            setNewSectionContext("");
        }
    };

    const handleRemoveSection = (section: string) => {
        updateBrief({ sections: data.brief.sections.filter(s => s !== section) });
    };

    const handleRefineBrief = async () => {
        if (!data.brief.description) return;
        setIsLoadingRefinement(true);
        const refinement = await AISuggestions.brief.refineBrief(data.brief.description, data.brief.projectType);
        setRefinementQuestions(refinement.questions);
        setStrategyTip(refinement.strategyTip);
        updateBrief({ description: refinement.premiumBrief });
        setIsRefining(true);
        setIsLoadingRefinement(false);
    };

    return (
        <div className="w-full max-w-6xl mx-auto flex gap-6 animate-in fade-in duration-700">
            {/* Main Form */}
            <Card className="flex-1 border-white/10 bg-zinc-900/40 backdrop-blur-md shadow-2xl">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <span className="text-indigo-400">01.</span> The Brief
                            </CardTitle>
                            <CardDescription>Define the strategic foundation of your project.</CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-[10px] uppercase font-bold tracking-widest border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10"
                            onClick={handleRefineBrief}
                            disabled={!data.brief.description || isLoadingRefinement}
                        >
                            {isLoadingRefinement ? (
                                <Sparkles className="w-3 h-3 mr-2 animate-spin" />
                            ) : (
                                <MessageSquarePlus className="w-3 h-3 mr-2" />
                            )}
                            {isLoadingRefinement ? 'Refining...' : 'Refine Brief ✨'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Project Type Selector */}
                    <div className="space-y-2">
                        <Label className="text-zinc-400 text-xs font-bold uppercase">Project Type</Label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {PROJECT_TYPES.map((type) => {
                                const Icon = type.icon;
                                const isSelected = data.brief.projectType === type.id;
                                return (
                                    <div
                                        key={type.id}
                                        onClick={() => {
                                            updateBrief({
                                                projectType: type.id as any,
                                                sections: type.defaultSections // Auto-switch defaults
                                            });
                                        }}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all gap-2 group h-24 text-center",
                                            isSelected
                                                ? "border-indigo-500 bg-indigo-500/10"
                                                : "border-white/5 bg-zinc-950/30 hover:border-zinc-700 hover:bg-zinc-950/50"
                                        )}
                                    >
                                        <Icon className={cn("w-5 h-5", isSelected ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                                        <div className="space-y-0.5">
                                            <p className={cn("text-[10px] font-bold uppercase tracking-tight", isSelected ? "text-white" : "text-zinc-400")}>{type.label}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Description Area */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-zinc-400 text-xs font-bold uppercase">What are you building?</Label>
                            <div className="relative">
                                <Textarea
                                    id="description"
                                    placeholder="e.g. A SaaS platform for AI-generated invoices..."
                                    className="h-28 bg-zinc-950/50 border-white/10 focus:border-indigo-500/50 font-mono text-sm resize-none"
                                    value={data.brief.description}
                                    onChange={(e) => updateBrief({ description: e.target.value })}
                                />
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="absolute bottom-2 right-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/50 text-xs"
                                    onClick={handleSuggest}
                                    disabled={!data.brief.description}
                                >
                                    <Sparkles className="w-3 h-3 mr-1" /> Auto-Analyze
                                </Button>
                            </div>
                        </div>

                        {/* AI Refinement Overlay/Panel */}
                        {isRefining && (
                            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl space-y-4 animate-in slide-in-from-top-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-indigo-300 font-bold text-[10px] uppercase tracking-widest">
                                        <Sparkles className="w-3 h-3" /> Strategist Follow-ups
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500" onClick={() => setIsRefining(false)}>
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {refinementQuestions.map((q, i) => (
                                        <div key={i} className="space-y-2">
                                            <p className="text-xs text-zinc-400 italic">"{q}"</p>
                                            <Input className="h-8 bg-zinc-950 border-white/5 text-xs text-zinc-300" placeholder="Your answer..." />
                                        </div>
                                    ))}
                                    <Button size="sm" className="w-full bg-indigo-600/80 hover:bg-indigo-600 h-8 text-[10px] uppercase font-bold" onClick={() => setIsRefining(false)}>
                                        Update Strategy
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="audience" className="text-zinc-400 text-xs font-bold uppercase">Target Audience</Label>
                        <Input
                            id="audience"
                            placeholder="e.g. Freelancers and Small Business Owners"
                            className="bg-zinc-950/50 border-white/10 focus:border-indigo-500/50 font-mono text-sm h-11"
                            value={data.brief.audience}
                            onChange={(e) => updateBrief({ audience: e.target.value })}
                        />
                    </div>

                    {/* Section Builder */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-zinc-400 text-xs font-bold uppercase">Dynamic Section Checklist</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                {(PROJECT_TYPES.find(t => t.id === data.brief.projectType)?.defaultSections || DEFAULT_SECTIONS).map((section) => (
                                    <div
                                        key={section}
                                        onClick={() => {
                                            const current = data.brief.sections;
                                            if (current.includes(section)) {
                                                updateBrief({ sections: current.filter((s) => s !== section) });
                                            } else {
                                                updateBrief({ sections: [...current, section] });
                                            }
                                        }}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all gap-1 group",
                                            data.brief.sections.includes(section)
                                                ? "border-indigo-500 bg-indigo-500/10"
                                                : "border-white/5 bg-zinc-950/50 hover:border-zinc-700"
                                        )}
                                    >
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-tighter",
                                            data.brief.sections.includes(section) ? "text-indigo-400" : "text-zinc-600 group-hover:text-zinc-400"
                                        )}>
                                            {section}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Custom Section Input */}
                        <div className="space-y-4 p-5 bg-zinc-950/40 border border-white/5 rounded-2xl shadow-inner-white">
                            <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest flex items-center gap-2">
                                <Terminal className="w-3 h-3 text-indigo-500" /> Custom Architecture
                            </Label>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        value={newSection}
                                        onChange={(e) => setNewSection(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSection()}
                                        placeholder="Section Name (e.g. Active Orbits)..."
                                        className="bg-zinc-900 border-white/10 text-xs font-mono h-10"
                                    />
                                    <Button onClick={handleAddCustomSection} className="bg-indigo-600 hover:bg-indigo-500 text-xs h-10 px-6">
                                        Add Section
                                    </Button>
                                </div>
                                <Textarea
                                    value={newSectionContext}
                                    onChange={(e) => setNewSectionContext(e.target.value)}
                                    placeholder="Extra context/requirements for this section... (Optional)"
                                    className="bg-zinc-900 border-white/10 text-xs font-mono h-20 resize-none italic text-zinc-400"
                                />
                            </div>

                            {data.brief.sections.filter(s => !DEFAULT_SECTIONS.includes(s)).length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {data.brief.sections.filter(s => !DEFAULT_SECTIONS.includes(s)).map(s => (
                                        <Badge
                                            key={s}
                                            variant="outline"
                                            className="bg-indigo-900/10 text-indigo-400 border-indigo-500/20 px-3 py-1 flex items-center gap-2 group relative"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                {s}
                                                {data.brief.sectionContext[s] && (
                                                    <div className="w-1 h-1 rounded-full bg-indigo-400" title={data.brief.sectionContext[s]} />
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleRemoveSection(s);
                                                }}
                                                className="ml-1 p-0.5 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center group/del"
                                            >
                                                <X className="w-2.5 h-2.5 text-indigo-400/60 group-hover/del:text-white" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button onClick={() => setStep(2)} className="bg-indigo-600 hover:bg-indigo-500 text-white group h-12 px-8 font-bold">
                            Next: Visual Strategy <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Sitemap Preview Sidebar */}
            <div className="w-80 hidden lg:block space-y-4">
                <div className="bg-zinc-950/50 border border-white/5 rounded-2xl p-6 h-full backdrop-blur-md shadow-xl flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-indigo-500/10 p-2 rounded-lg">
                            <ListTree className="w-4 h-4 text-indigo-400" />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Live Sitemap Preview</h4>
                    </div>

                    <div className="flex-1 space-y-2">
                        {data.brief.sections.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-2">
                                <Terminal className="w-10 h-10" />
                                <p className="text-[10px] font-mono italic">Architecture empty...</p>
                            </div>
                        ) : (
                            <div className="space-y-3 relative">
                                <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-zinc-800" />
                                {data.brief.sections.map((section, i) => (
                                    <div key={section} className="flex items-center gap-4 group">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-[10px] font-mono font-bold text-zinc-600 group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-all z-10">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 p-2 rounded border border-white/5 bg-zinc-900/30 text-[11px] font-bold text-zinc-400 group-hover:bg-indigo-500/5 group-hover:text-indigo-300 transition-all uppercase tracking-tighter">
                                            {section}
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-center gap-4 opacity-30 mt-6">
                                    <div className="w-8 h-2 rounded bg-zinc-800 ml-0" />
                                    <div className="flex-1 h-2 rounded bg-zinc-900" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 p-4 bg-zinc-900 rounded-xl border border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-zinc-600 uppercase">Estimated Page Depth</span>
                            <span className="text-[10px] font-mono font-bold text-indigo-400">{data.brief.sections.length * 800}px</span>
                        </div>
                        <div className="w-full bg-zinc-950 rounded-full h-1 overflow-hidden">
                            <div
                                className="bg-indigo-500 h-full transition-all duration-500"
                                style={{ width: `${Math.min(data.brief.sections.length * 10, 100)}%` }}
                            />
                        </div>
                        {strategyTip && (
                            <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                                <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <Sparkles className="w-2 h-2" /> Strategy Tip
                                </p>
                                <p className="text-[9px] text-zinc-400 leading-relaxed italic">
                                    {strategyTip}
                                </p>
                            </div>
                        )}
                        <p className="text-[9px] text-zinc-600 italic pt-2">Complexity score: {data.brief.sections.length > 7 ? 'High Enterprise' : data.brief.sections.length > 3 ? 'Standard Landing' : 'Minimalist'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
