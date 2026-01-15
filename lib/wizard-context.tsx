"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export type SectionSpec = {
    id: string; // The section name (e.g., "Hero")
    sourceCode: string;
    layoutPattern: string;
    animationSpec: string;
};

export type WizardData = {
    brief: {
        description: string;
        audience: string;
        goal: string;
        sections: string[];
        sectionContext: Record<string, string>;
    };
    vibe: {
        keywords: string[];
        theme: "dark" | "light";
        accent: string;
        secondary: string;
        effects: string[];
        fonts: {
            heading: string;
            body: string;
            mono: string;
        };
        uploadedFiles: string[];
        references: string;
    };
    specs: {
        techStack: string;
        sectionBlueprints: Record<string, SectionSpec>;
        animationLevel: "static" | "subtle" | "heavy";
    };
    generatedDocs?: {
        core: Record<string, string>;
        sections: Record<string, string>;
    };
};

interface WizardContextType {
    step: number;
    setStep: (step: number) => void;
    data: WizardData;
    updateBrief: (data: Partial<WizardData["brief"]>) => void;
    updateVibe: (data: Partial<WizardData["vibe"]>) => void;
    updateSpecs: (data: Partial<WizardData["specs"]>) => void;
    updateSectionBlueprint: (sectionId: string, spec: Partial<SectionSpec>) => void;
    setGeneratedDocs: (docs: WizardData["generatedDocs"]) => void;
}

const defaultData: WizardData = {
    brief: {
        description: "",
        audience: "",
        goal: "Download",
        sections: ["Hero", "Features", "Footer"],
        sectionContext: {},
    },
    vibe: {
        keywords: [],
        theme: "dark",
        accent: "#6366f1",
        secondary: "#a855f7",
        effects: [],
        fonts: {
            heading: "",
            body: "",
            mono: "",
        },
        uploadedFiles: [],
        references: "",
    },
    specs: {
        techStack: "Next.js 14, Tailwind, Shadcn, Lucide",
        sectionBlueprints: {},
        animationLevel: "subtle",
    },
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<WizardData>(defaultData);

    const updateBrief = (updates: Partial<WizardData["brief"]>) =>
        setData((prev) => ({ ...prev, brief: { ...prev.brief, ...updates } }));

    const updateVibe = (updates: Partial<WizardData["vibe"]>) =>
        setData((prev) => ({ ...prev, vibe: { ...prev.vibe, ...updates } }));

    const updateSpecs = (updates: Partial<WizardData["specs"]>) =>
        setData((prev) => ({ ...prev, specs: { ...prev.specs, ...updates } }));

    const updateSectionBlueprint = (sectionId: string, updates: Partial<SectionSpec>) => {
        setData((prev) => {
            const currentSpec = prev.specs.sectionBlueprints[sectionId] || {
                id: sectionId,
                sourceCode: "",
                layoutPattern: "",
                animationSpec: "",
            };
            return {
                ...prev,
                specs: {
                    ...prev.specs,
                    sectionBlueprints: {
                        ...prev.specs.sectionBlueprints,
                        [sectionId]: { ...currentSpec, ...updates }
                    }
                }
            };
        });
    };

    const setGeneratedDocs = (docs: WizardData["generatedDocs"]) =>
        setData((prev) => ({ ...prev, generatedDocs: docs }));

    return (
        <WizardContext.Provider value={{ step, setStep, data, updateBrief, updateVibe, updateSpecs, updateSectionBlueprint, setGeneratedDocs }}>
            {children}
        </WizardContext.Provider>
    );
}

export function useWizard() {
    const context = useContext(WizardContext);
    if (context === undefined) {
        throw new Error("useWizard must be used within a WizardProvider");
    }
    return context;
}
