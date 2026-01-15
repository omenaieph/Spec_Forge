import { refineBriefAI, suggestBlueprintAI, suggestStyleAI } from "./ai-actions";

export const AISuggestions = {
    brief: {
        suggestStats: (description: string, projectType: string = "website") => {
            if (projectType === "saas") {
                return {
                    audience: "Business Owners, Teams, and Enterprise Users",
                    sections: ["Onboarding", "Dashboard", "Projects", "Analytics", "Settings", "Billing", "Team"],
                };
            }
            if (projectType === "marketplace") {
                return {
                    audience: "Buyers and Sellers / Hosts and Guests",
                    sections: ["Search Hero", "Categories", "Featured Listings", "Map View", "Vendor Profile", "Booking Flow"],
                };
            }
            if (projectType === "social") {
                return {
                    audience: "Community Members, Creators, and Influencers",
                    sections: ["Feed", "Create Post", "User Profile", "Comments", "Notifications", "Messaging"],
                };
            }
            if (projectType === "ai") {
                return {
                    audience: "Early Adopters, Creatives, and Data Analysts",
                    sections: ["Prompt Input", "Chat Interface", "Result Display", "History", "Templates", "Settings"],
                };
            }
            if (projectType === "dashboard") {
                return {
                    audience: "Admins, Managers, and Internal Staff",
                    sections: ["Overview Stats", "Data Tables", "Filters", "User Management", "Reports", "Logs"],
                };
            }
            if (projectType === "content") {
                return {
                    audience: "Readers, Subscribers, and Enthusiasts",
                    sections: ["Featured Article", "Latest Posts", "Categories", "Author Profile", "Article View", "Newsletter"],
                };
            }
            if (projectType === "mobile") {
                return {
                    audience: "Mobile-first Consumers",
                    sections: ["Splash Screen", "Onboarding", "Tab Navigation", "Feed", "User Profile", "Settings"],
                };
            }
            if (projectType === "ecommerce") {
                return {
                    audience: "Online Shoppers",
                    sections: ["Hero", "Featured Products", "Collections", "Product Grid", "Cart", "Checkout"],
                };
            }
            if (projectType === "backend") {
                return {
                    audience: "Developers and System Architects",
                    sections: ["API Reference", "Auth Patterns", "Endpoints", "Database Schema", "Architecture", "Errors"],
                };
            }

            // Fallback / Marketing logic
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
        refineBrief: async (description: string, projectType: string = "website") => {
            const result = await refineBriefAI(description, projectType);
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
        suggestStyle: async (description: string, projectType: string = "website") => {
            const result = await suggestStyleAI(`${description} | Type: ${projectType}`);
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
