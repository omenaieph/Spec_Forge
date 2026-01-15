import { WizardData } from "./wizard-context";

export function generateProductBrief(data: WizardData) {
    return `# Project Brief
## What is the product?
${data.brief.description}

## Who is it for?
${data.brief.audience}

## Core Sections
${data.brief.sections.map((s) => `- ${s}`).join("\n")}

## Primary Goal
${data.brief.goal}
`;
}

export function generateStyleGuide(data: WizardData) {
    return `# STYLE_GUIDE.md

## 01. Visual Foundation
- **Theme**: ${data.vibe.theme.toUpperCase()} MODE [cite: 161]
- **Primary Accent**: ${data.vibe.accent} (Dominant color for CTAs, active states, and primary glows) [cite: 167]
- **Secondary Accent**: ${data.vibe.secondary} (Accent color for borders, badges, secondary shadows, and gradients) [cite: 358]
- **Surface Geometry**: ${data.vibe.effects.includes('Glassmorphism') ? 'Glassmorphic (backdrop-blur-md) with 1px border-white/10' : 'Solid Zinc-950 surfaces'} [cite: 171]

## 02. Typography Lab [cite: 201]
- **Headlines**: ${data.vibe.fonts.heading || 'Inter'} (Font-weight: 700/800, Tracking: -0.02em)
- **Body**: ${data.vibe.fonts.body || 'Inter'} (Font-weight: 400/500, Leading: 1.6)
- **Accent/Mono**: ${data.vibe.fonts.mono || 'JetBrains Mono'} (Used for technical labels, badges, and code snippets)

## 03. Global Spacing & Layout Structure [cite: 433]
- **Section Padding**: Standard vertical padding: 80px to 120px (\`py-20\` to \`py-32\`).
- **Container**: Max-width 1280px (\`max-w-7xl\`) with 24px side padding (\`px-6\`).
- **Grid Gap**: Standard grid spacing: 24px to 32px (\`gap-6\` to \`gap-8\`).

## 04. Component Governance
- All components MUST adhere to the **Visual Treatment** defined above.
- Implementation MUST use Tailwind CSS variables where applicable.
- **Strict Governance**: If implementation diverges from this guide, the guide must be updated immediately.
`;
}

export function generateImplementationPlan(data: WizardData) {
    const sections = data.brief.sections;
    return `# tasks.md

## Phase 1: Environment Setup
- [ ] Initialize Next.js 14 project with Tailwind and Shadcn/UI
- [ ] Install dependencies: \`framer-motion\`, \`lucide-react\`, clsx, tailwind-merge
- [ ] Create \`website-guidelines\` folder and move all .md files there

## Phase 2: Core Build (Section by Section)
${sections.map((section, i) => `- [ ] Build ${i + 1}. ${section} (Reference website-sections/${i + 1}.${section.toLowerCase().replace(/\s+/g, '-')}.md)`).join('\n')}

## Phase 3: Global Polishing
- [ ] Implement global smooth scroll and scroll-triggered entrance animations
- [ ] Final responsive audit for mobile/tablet
`;
}

export function generateRequirements(data: WizardData) {
    return `# Project Requirements
## Core Objectives
${data.brief.description}

## Technical Constraints
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Animation: ${data.specs.animationLevel} (Framer Motion)

## Information Architecture
${data.brief.sections.map(s => `- ${s}`).join('\n')}

## Global Style Governance
- Theme: ${data.vibe.theme}
- Primary Accent: ${data.vibe.accent}
- Secondary Accent: ${data.vibe.secondary}
- Font Primary: ${data.vibe.fonts.heading}
`;
}

export function generateSectionSpec(section: string, data: WizardData) {
    const spec = data.specs.sectionBlueprints[section];
    return `# Section Blueprint: ${section}

## 01. Strategic Context [cite: 41, 97]
- **Project Goal**: ${data.brief.goal} [cite: 53-54]
- **Section Objective**: ${data.brief.sectionContext[section] || `Standard requirements for ${section} based on project framework.`} [cite: 13, 110]

## 02. Technical DNA (The Logic) [cite: 303]
- **Layout Pattern**: ${spec?.layoutPattern || 'Not specified - use framework defaults'} [cite: 264-265]
- **Aesthetic Keywords**: ${data.vibe.keywords.join(', ')} [cite: 140, 159]
- **Visual Treatment**: ${data.vibe.theme.toUpperCase()} mode with Primary (${data.vibe.accent}) and Secondary (${data.vibe.secondary}) accents. [cite: 161-163]
- **Motion Spec**: ${spec?.animationSpec || 'Subtle Framer Motion entrance'} [cite: 262-263]

## 03. Component Source / DNA [cite: 308]
### [${section} DNA]
- **Source**: 21st.dev / shadcn / Custom [cite: 305]
- **Implementation Code**:
\`\`\`tsx
${spec?.sourceCode || "// No specific source provided. Use default library components."}
\`\`\`

## 04. Detailed Design Instructions [cite: 316-317, 433]
- **Typography**: Headlines in ${data.vibe.fonts.heading || 'Inter'}, Body in ${data.vibe.fonts.body || 'Inter'}. [cite: 167-170]
- **Effects**: ${data.vibe.effects.join(', ')}. [cite: 147-148, 171-172]
- **Spacing**: Use standard section padding of 80px-120px (py-20 to py-32). [cite: 463-464]
`;
}

export function generateDesignMoodboard(data: WizardData) {
    return `# Design Moodboard
## Vibe
${data.vibe.references ? `References:\n${data.vibe.references}` : "No specific references provided."}

## Atmosphere
- Animation Level: ${data.specs.animationLevel}
- Visual Style: ${data.vibe.keywords.join(", ")}
`;
}
