import { refineBriefAI, suggestBlueprintAI, suggestStyleAI } from "./ai-actions";

export const AISuggestions = {
    brief: {
        suggestStats: (description: string) => {
            // Static categorization still useful for speed
            if (description.toLowerCase().includes("developer") || description.toLowerCase().includes("doc")) {
                return {
                    audience: "Developers, CTOs, and Product Managers",
                    sections: ["Hero", "Features", "Integration", "Docs", "Pricing", "Footer"],
                };
            }
            if (description.toLowerCase().includes("finance") || description.toLowerCase().includes("bank")) {
                return {
                    audience: "Investors, Traders, and Financial Analysts",
                    sections: ["Hero", "Market Data", "Security", "Testimonials", "FAQ", "Footer"],
                };
            }
            return {
                audience: "General Consumers looking for a high-quality solution",
                sections: ["Hero", "Problem/Solution", "Benefits", "Testimonials", "CTA", "Footer"],
            };
        },
        refineBrief: async (description: string) => {
            const result = await refineBriefAI(description);
            if (result) return result;

            // Fallback to mock if API fails/key missing
            return {
                premiumBrief: `An elite, data-driven ${description} built for high-performance scale.`,
                questions: ["What is the core value prop?", "Who is the ideal user?", "What is the primary goal?"],
                strategyTip: "Social proof increases conversion."
            };
        }
    },

    vibe: {
        suggestStyle: async (description: string) => {
            const result = await suggestStyleAI(description);
            if (result) return result;

            // Fallback logic
            return {
                keywords: ["Clean/SaaS", "Dark/Glowing", "Minimal/Swiss"],
                accent: "#6366f1",
                secondary: "#a855f7",
                fonts: { heading: "Inter", body: "Inter", mono: "JetBrains Mono" },
                effects: ["Glassmorphism", "Radial Glows", "Dot Pattern"],
            };
        },
    },

    // NEW: The SpecForge Strategist Logic
    specs: {
        suggestBlueprint: async (section: string, data: any) => {
            const result = await suggestBlueprintAI(section, data);
            if (result) return result;

            // Fallback logic
            return {
                layout: "Clean, minimal layout focused on readability.",
                motion: "Subtle fade-in on scroll.",
                dna: `### [${section} DNA]\n- **Visuals**: Consistent with project theme.\n- **Components**: Standard UI components.`
            };
        }
    }
};
