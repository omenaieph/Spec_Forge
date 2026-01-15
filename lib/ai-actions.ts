"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!API_KEY && process.env.NODE_ENV === 'development') {
    console.warn("WARNING: GOOGLE_GENERATIVE_AI_API_KEY is not defined. SpecForge AI features will fail.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");
const GENERATION_MODEL = "gemini-2.0-flash-exp";

export async function refineBriefAI(description: string, projectType: string = "website") {
    try {
        const model = genAI.getGenerativeModel({ model: GENERATION_MODEL });
        const prompt = `
            Role: You are a world-class Product Strategist (ex-McKinsey/IDEO).
            Task: Analyze the user's initial project description and refine it into a high-fidelity Product Brief.
            
            Project Type: ${projectType}
            Description: "${description}"
            
            Protocol:
            1. Rewrite the description to be "Premium," "Elite," and highly specific. Avoid generic corporate jargon; use precise engineering and product terminology.
            2. Identify 3 specific, deep follow-up questions to extract deeper strategy (e.g., regarding edge cases, monetization, or specific user flows).
            3. Provide one "Strategy Tip" about sitemap architecture or conversion optimization.
            
            Output in JSON format (ensure valid JSON):
            {
                "premiumBrief": "string",
                "questions": ["string", "string", "string"],
                "strategyTip": "string"
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, "").trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Error (refineBriefAI):", error);
        return null;
    }
}

export async function suggestBlueprintAI(section: string, context: any) {
    try {
        const model = genAI.getGenerativeModel({ model: GENERATION_MODEL });
        const prompt = `
            Role: SpecForge Strategist AI.
            Task: Generate technical DNA for a website section based on project context.
            
            Section: ${section}
            Specific Section Context: ${context.brief.sectionContext?.[section] || "None provided"}
            
            Project Type: ${context.brief.projectType || "website"}
            Overall Project Brief: ${JSON.stringify(context.brief.description)}
            Target Audience: ${JSON.stringify(context.brief.audience)}
            Visual Context: ${JSON.stringify(context.vibe)}
            
            Output in JSON format:
            {
                "layout": "string describing layout pattern",
                "motion": "string describing animation spec",
                "dna": "markdown string for Technical DNA section"
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, "").trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Error (suggestBlueprintAI):", error);
        return null;
    }
}

export async function suggestStyleAI(description: string) {
    try {
        const model = genAI.getGenerativeModel({ model: GENERATION_MODEL });
        const prompt = `
            Role: UI/UX Aesthetic Architect (Awwwards Jury Member level).
            Task: Suggest a high-end design system based on a project brief.
            
            Project Type: ${description.includes(" | Type: ") ? description.split(" | Type: ")[1] : "website"}
            Description: "${description}"
            
            Protocol:
            1. Suggest 5 keywords (e.g., "Achromatic", "Kinetic", "Brutalist", "Ethereal").
            2. Suggest a coordinated Dual-Accent Palette (ensure high contrast and harmony).
            3. Suggest Typography (Headings, Body, Mono) - recommend specific Google Fonts or standard alternatives.
            4. Suggest 3-4 visual effects (e.g., "Glassmorphism", "Bento Grid", "Grainy Gradients", "Neu-brutalism").
            
            Output in JSON format:
            {
                "keywords": ["string"],
                "accent": "#hexcode",
                "secondary": "#hexcode",
                "fonts": {
                    "heading": "string font name",
                    "body": "string font name",
                    "mono": "string font name"
                },
                "effects": ["string"]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, "").trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Error (suggestStyleAI):", error);
        return null;
    }
}

export async function generateProjectDocs(data: any) {
    try {
        const model = genAI.getGenerativeModel({ model: GENERATION_MODEL });

        const projectType = data.brief.projectType || "website";

        const [briefResult, styleResult, requirementsResult, tasksResult, moodboardResult] = await Promise.all([
            model.generateContent(`
                Role: Chief Product Officer.
                Task: Write a comprehensive Product Brief for a ${projectType}.
                Data: ${JSON.stringify(data.brief)}
                Output: Full Markdown file content starting with # Product Brief.
                Requirements: analyze personas, success metrics, and future roadmap ideas specific to a ${projectType}.
            `),
            model.generateContent(`
                Role: Design Systems Lead.
                Task: Write a comprehensive STYLE_GUIDE.md.
                Data: ${JSON.stringify(data.vibe)}
                Output: Full Markdown file content starting with # STYLE_GUIDE.md.
                Requirements: Define specific tailwind classes, typography hierarchy, and UI tokens.
            `),
            model.generateContent(`
                Role: Senior Engineering Manager.
                Task: Write a detailed PROJECT_REQUIREMENTS.md for a ${projectType}.
                Data: ${JSON.stringify(data)}
                Output: Full Markdown file content starting with # Project Requirements.
                Requirements: List Functional/Non-Functional requirements, data schemas, and constraints for a ${projectType}.
            `),
            model.generateContent(`
                Role: Technical Project Manager.
                Task: Write a detailed implementation plan (tasks.md) for a ${projectType}.
                Data: ${JSON.stringify(data.brief.sections)}
                Output: Full Markdown file content starting with # Implementation Tasks.
                Requirements: phased phases (Setup, Core, Polish) and specific library suggestions.
            `),
            model.generateContent(`
                Role: Creative Director.
                Task: Write a conceptual Design Moodboard (moodboard.md).
                Data: ${JSON.stringify(data.vibe)}
                Output: Full Markdown file content starting with # Design Moodboard.
                Requirements: Cinematic vibe description, motion atmosphere, and palette details.
            `)
        ]);

        return {
            "product-brief.md": briefResult.response.text(),
            "STYLE_GUIDE.md": styleResult.response.text(),
            "PROJECT_REQUIREMENTS.md": requirementsResult.response.text(),
            "tasks.md": tasksResult.response.text(),
            "moodboard.md": moodboardResult.response.text()
        };

    } catch (error) {
        console.error("Gemini Doc Generation Error:", error);
        return null;
    }
}

export async function generateSectionDetails(section: string, data: any) {
    try {
        const model = genAI.getGenerativeModel({ model: GENERATION_MODEL });
        const context = data.brief.sectionContext?.[section] || "Standard implementation";

        const prompt = `
            Role: Senior Frontend Architect.
            Task: Create a deep technical blueprint for the "${section}" section.
            
            Context:
            - Project Type: ${data.brief.projectType || "website"}
            - Goal: ${data.brief.goal}
            - Style: ${JSON.stringify(data.vibe)}
            - Section Requirements: ${context}
            
            Output: Full Markdown file content starting with # Section Blueprint: ${section}.
            
            Requirements:
            1. Strategic Context.
            2. Technical DNA (Layout, Animation, Responsive).
            3. Component Interface (TypeScript Props, State).
            4. Structure/JSX Pseudocode.
            5. Accessibility.
        `;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error(`Gemini Section Gen Error (${section}):`, error);
        return `# Error Generating Section ${section}\n\nPlease try again.`;
    }
}
