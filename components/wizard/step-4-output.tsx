"use client";

import React, { useState } from "react";
import { useWizard } from "@/lib/wizard-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    generateProductBrief,
    generateStyleGuide,
    generateImplementationPlan,
    generateDesignMoodboard,
    generateRequirements,
    generateSectionSpec
} from "@/lib/generators";
import {
    ArrowLeft,
    Check,
    Clipboard,
    Download,
    FileText,
    Folder,
    Monitor,
    MessageSquareCode,
    ChevronRight,
    Search,
    Sparkles
} from "lucide-react";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { cn } from "@/lib/utils";

import { generateProjectDocs, generateSectionDetails } from "@/lib/ai-actions";

export function Step4Output() {
    const { data, setStep, setGeneratedDocs, updateBrief } = useWizard();
    const [activeFile, setActiveFile] = useState<string>("product-brief.md");
    const [copied, setCopied] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Initialize with fallback templates if no AI docs yet
    const fallbackCore = {
        "product-brief.md": generateProductBrief(data),
        "STYLE_GUIDE.md": generateStyleGuide(data),
        "tasks.md": generateImplementationPlan(data),
        "moodboard.md": generateDesignMoodboard(data),
        "PROJECT_REQUIREMENTS.md": generateRequirements(data),
    };

    const fallbackSections: Record<string, string> = {};
    data.brief.sections.forEach((s, i) => {
        const fileName = `${i + 1}.${s.toLowerCase().replace(/\s+/g, '-')}.md`;
        fallbackSections[fileName] = generateSectionSpec(s, data);
    });

    // Use generated docs if available, otherwise fallbacks
    const coreFiles = data.generatedDocs?.core || fallbackCore;
    const sectionFiles = data.generatedDocs?.sections || fallbackSections;
    const allFiles = { ...coreFiles, ...sectionFiles };

    // Trigger Generation on mount if not already generated
    React.useEffect(() => {
        if (!data.generatedDocs && !isGenerating) {
            const runGeneration = async () => {
                setIsGenerating(true);
                try {
                    // 1. Generate Core Docs
                    const coreDocs = await generateProjectDocs(data);

                    // 2. Generate Section Docs in Parallel
                    const sectionPromises = data.brief.sections.map(async (section, i) => {
                        const content = await generateSectionDetails(section, data);
                        const fileName = `${i + 1}.${section.toLowerCase().replace(/\s+/g, '-')}.md`;
                        return { fileName, content };
                    });

                    const sectionsResults = await Promise.all(sectionPromises);
                    const sectionsMap = sectionsResults.reduce((acc, curr) => {
                        acc[curr.fileName] = curr.content;
                        return acc;
                    }, {} as Record<string, string>);

                    // 3. Save to Context
                    if (coreDocs && sectionsMap) {
                        setGeneratedDocs({
                            core: coreDocs,
                            sections: sectionsMap
                        });
                    }
                } catch (e) {
                    console.error("Generation failed", e);
                } finally {
                    setIsGenerating(false);
                }
            };
            runGeneration();
        }
    }, [data.generatedDocs]);

    const handleDownloadZip = async () => {
        const zip = new JSZip();

        // 1. Guidelines
        const guidelines = zip.folder("website-guidelines");
        if (guidelines) {
            guidelines.file("product-brief.md", coreFiles["product-brief.md"]);
            guidelines.file("STYLE_GUIDE.md", coreFiles["STYLE_GUIDE.md"]);
            guidelines.file("PROJECT_REQUIREMENTS.md", coreFiles["PROJECT_REQUIREMENTS.md"]);
            guidelines.file("tasks.md", coreFiles["tasks.md"]);
            guidelines.file("moodboard.md", coreFiles["moodboard.md"]);
        }

        // 2. Sections
        const sections = zip.folder("website-sections");
        if (sections) {
            Object.entries(sectionFiles).forEach(([name, content]) => {
                sections.file(name, content);
            });
        }

        // 3. Governance
        const cursorRules = zip.folder(".cursor/rules");
        if (cursorRules) {
            cursorRules.file("style-guide-governance.mdc", `
description: Ensures the style guide stays in sync with implementation
globs: **/*
alwaysApply: true
## Style Guide Governance
The guidelines in website-guidelines/STYLE_GUIDE.md are the authoritative global design system.
If implementation diverges from style guide, you MUST update the guide first.
        `);
            cursorRules.file("section-blueprints-governance.mdc", `
description: Ensures each section follows its specialized technical DNA
globs: src/components/sections/**/*
alwaysApply: false
## Section Blueprint Governance
Before building or modifying any file in src/components/sections/, you MUST read the corresponding blueprint in website-sections/.
Adhere strictly to the "Technical DNA", "Layout Pattern", and "Animation Spec" defined in the blueprint.
        `);
        }

        // 4. Instructions
        zip.file("START_HERE_AI_INSTRUCTIONS.md", `
# How to build this with AI
1. Copy these folders (\`website-guidelines\`, \`website-sections\`, \`.cursor\`) to your project root.
2. Use an advanced model like Gemini 2.0 or Claude 3.5 Sonnet.
3. **START**: First message to AI: "Read website-guidelines/PROJECT_REQUIREMENTS.md and STYLE_GUIDE.md. Acknowledge these and do not build yet."
4. **BUILD**: One section at a time. Refer to the specific blueprint in \`website-sections/\`.
    `);

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `specforge-scaffold.zip`);
    };

    const copyToClipboard = async (text: string, key: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(key);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    const copySystemPrompt = () => {
        const prompt = `I am providing a professional project scaffold including a Style Guide, Project Requirements, and Section Blueprints. Before we write any code, read the files in website-guidelines/ to understand the visual language and technical DNA. Confirm when you are ready to build the first section.`;
        copyToClipboard(prompt, 'system-prompt');
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6 flex flex-col items-center px-4 sm:px-0">

            {/* Header Action Bar */}
            <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 px-0 sm:px-4 group">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg sm:text-xl font-bold font-mono tracking-tighter text-indigo-400 uppercase">
                        Architectural Ecosystem
                    </h2>
                    {isGenerating && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            <Sparkles className="w-3 h-3 text-indigo-400 animate-spin" />
                            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-indigo-300 animate-pulse whitespace-nowrap">Fabricating Intelligence...</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10 text-xs sm:text-xs h-10 sm:h-8"
                        onClick={copySystemPrompt}
                    >
                        {copied === 'system-prompt' ? <Check className="w-3 h-3 mr-2 text-green-400" /> : <MessageSquareCode className="w-3 h-3 mr-2" />}
                        {copied === 'system-prompt' ? 'Copied prompt' : 'Copy System Prompt'}
                    </Button>
                    <Button
                        size="sm"
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 text-xs sm:text-xs h-10 sm:h-8"
                        onClick={handleDownloadZip}
                        disabled={isGenerating}
                    >
                        {isGenerating ? <Sparkles className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                        {isGenerating ? 'Compiling...' : 'Download Project ZIP'}
                    </Button>
                </div>
            </div>

            <Card className="border-white/10 bg-zinc-900/40 backdrop-blur-md shadow-2xl w-full overflow-hidden flex flex-col lg:flex-row min-h-[500px] lg:h-[700px]">
                {/* File Explorer Sidebar */}
                <div className="w-full lg:w-72 bg-zinc-950/50 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col shrink-0">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Workspace</span>
                        <Folder className="w-3 h-3 text-zinc-600" />
                    </div>

                    <div className="flex-1 overflow-y-auto lg:overflow-y-auto max-h-[300px] lg:max-h-none p-2 space-y-6">
                        {/* Guidelines Group */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 px-2 py-1 text-[9px] font-bold text-zinc-600 uppercase tracking-widest bg-zinc-900/40 rounded">
                                <ChevronRight className="w-2 h-2" /> Guidelines
                            </div>
                            {Object.keys(coreFiles).map(file => (
                                <div
                                    key={file}
                                    onClick={() => setActiveFile(file)}
                                    className={cn(
                                        "px-3 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-2 font-mono text-[10px] sm:text-[11px]",
                                        activeFile === file
                                            ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                                            : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                                    )}
                                >
                                    <FileText className={cn("w-3 h-3 shrink-0", activeFile === file ? "text-indigo-400" : "text-zinc-600")} />
                                    <span className="truncate">{file}</span>
                                </div>
                            ))}
                        </div>

                        {/* Sections Group */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 px-2 py-1 text-[9px] font-bold text-zinc-600 uppercase tracking-widest bg-zinc-900/40 rounded">
                                <ChevronRight className="w-2 h-2" /> Sections
                            </div>
                            {Object.keys(sectionFiles).map(file => (
                                <div
                                    key={file}
                                    onClick={() => setActiveFile(file)}
                                    className={cn(
                                        "px-3 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-2 font-mono text-[10px] sm:text-[11px]",
                                        activeFile === file
                                            ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                                            : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                                    )}
                                >
                                    <FileText className={cn("w-3 h-3 shrink-0", activeFile === file ? "text-indigo-400" : "text-zinc-600")} />
                                    <span className="truncate">{file}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Vision Preview Tile - Hidden on small mobile sidebar to save space if needed, or styled compact */}
                    <div className="p-4 bg-zinc-900/80 border-t border-white/5 space-y-3 hidden sm:block">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Vision Preview</span>
                            <Monitor className="w-3 h-3 text-indigo-500" />
                        </div>
                        <div className="p-3 bg-zinc-950 rounded border border-white/5 space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 flex-1">
                                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: data.vibe.accent }} />
                                    <span className="text-[9px] font-mono text-zinc-500 uppercase truncate">{data.vibe.accent}</span>
                                </div>
                                <div className="flex items-center gap-1.5 flex-1">
                                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: data.vibe.secondary }} />
                                    <span className="text-[9px] font-mono text-zinc-500 uppercase truncate">{data.vibe.secondary}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Code Content Area */}
                <div className="flex-1 flex flex-col bg-zinc-950 min-h-0">
                    <div className="bg-zinc-900/50 px-4 sm:px-6 py-3 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 bg-dots-grid shrink-0">
                        <div className="font-mono text-[10px] sm:text-[11px] text-zinc-400 flex items-center gap-2 truncate w-full">
                            <span className="text-indigo-500 shrink-0">~/workspace/</span>
                            <span className="truncate">{activeFile}</span>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                            {isGenerating && (
                                <span className="text-[9px] text-indigo-400 animate-pulse flex items-center whitespace-nowrap">
                                    <Sparkles className="w-3 h-3 mr-1" /> Generating...
                                </span>
                            )}
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-[9px] sm:text-[10px] bg-zinc-900 border border-white/10 hover:bg-indigo-500 hover:text-white transition-all whitespace-nowrap"
                                onClick={() => copyToClipboard(allFiles[activeFile as keyof typeof allFiles], activeFile)}
                            >
                                {copied === activeFile ? <Check className="w-3 h-3 mr-1.5" /> : <Clipboard className="w-3 h-3 mr-1.5" />}
                                {copied === activeFile ? "Copied" : "Copy"}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-4 sm:p-8 font-mono text-[12px] sm:text-sm leading-relaxed text-zinc-400/90 selection:bg-indigo-500/30 min-h-0">
                        <pre className="whitespace-pre-wrap break-all sm:break-normal">
                            {allFiles[activeFile as keyof typeof allFiles]}
                        </pre>
                    </div>
                </div>
            </Card>

            {/* Navigation Footer */}
            <div className="flex justify-between w-full px-0 sm:px-4 pt-4">
                <Button variant="ghost" onClick={() => setStep(3)} className="hover:bg-zinc-800 hover:text-white text-xs">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Modify Specs
                </Button>
            </div>
        </div>
    );
}
