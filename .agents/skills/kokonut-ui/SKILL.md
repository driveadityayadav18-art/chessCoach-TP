---
name: kokonut-ui
description: Use this skill when users want to add, build, or customize Kokonut UI components in React/Next.js projects. Kokonut UI provides 100+ modern animated UI components, AI interaction patterns (prompt inputs, agent lanes, token streaming, tool call cards), rich inputs, micro-interactions, and visual backgrounds built on Tailwind CSS, Motion, and shadcn/ui.
metadata:
  short-description: Add and customize Kokonut UI components and AI UI patterns
---

# Kokonut UI

Kokonut UI is a rich library of 100+ modern React components built with **Tailwind CSS**, **Motion (Framer Motion)**, and designed for the **shadcn/ui** registry ecosystem.

## When to Use

Apply this skill when:
- Adding modern interactive components (e.g. `action-search-bar`, `bento-grid`, `card-flip`, `liquid-gauge`, `smooth-tab`, `status-island`, `toolbar`).
- Building AI-native user interfaces:
  - `ai-prompt`, `ai-input-search`, `ai-autocomplete` (input fields)
  - `ai-agent-lanes`, `ai-branches`, `ai-handoff` (agent workflows)
  - `ai-tool-calls`, `ai-tool-approval`, `ai-diff-review` (tool cards and review flows)
  - `ai-loading`, `ai-text-loading`, `ai-context-meter`, `ai-citations` (streaming & indicators)
- Adding stylized animated backgrounds (`background-paths`, `caustics-background`, `flow-field`, `topo-background`, `rain-glass-background`).
- Adding micro-interactions (`attract-button`, `slide-to-confirm`, `hold-button`, `tear-button`, `receipt-printer`).

## Installation & Setup

### 1. Add Registry to `components.json`
In projects configured with `shadcn/ui`, add Kokonut UI to `components.json`:

```json
{
  "registries": {
    "@kokonutui": "https://kokonutui.com/r/{name}.json"
  }
}
```

### 2. Add Components via shadcn CLI
```bash
npx shadcn@latest add @kokonutui/<component-name>
```

Examples:
```bash
npx shadcn@latest add @kokonutui/action-search-bar
npx shadcn@latest add @kokonutui/ai-prompt
npx shadcn@latest add @kokonutui/bento-grid
npx shadcn@latest add @kokonutui/background-paths
```

### 3. Direct Integration (Without Registry CLI)
If the CLI registry is not used, components can be added directly into `components/kokonutui/<component-name>.tsx` with required dependencies:
```bash
npm install motion lucide-react clsx tailwind-merge
```

## Available Component Catalog

### AI UI Patterns:
- `ai-prompt`: Rich prompt textarea with action buttons and attachments
- `ai-input-search`: Dynamic search and command bar with AI suggestions
- `ai-agent-lanes`: Parallel agent workflow status lanes
- `ai-tool-calls` & `ai-tool-approval`: Human-in-the-loop tool execution and confirmation cards
- `ai-diff-review`: Inline code diff and change reviewer
- `ai-context-meter`: Visual gauge for token / context window capacity
- `ai-citations`: Interactive source citation chips
- `ai-voice`: Animated audio / speech visualizer

### Animated Micro-Interactions:
- `attract-button`: Magnetic hover button
- `slide-to-confirm`: Swipe / slide confirmation gesture
- `hold-button`: Press-and-hold trigger with progress ring
- `particle-button`: Particle explosion on action
- `receipt-printer`: Animated fold-out receipt animation

### Cards & Layouts:
- `bento-grid`: Asymmetric feature grid with motion hover states
- `card-flip`: 3D flip card for two-sided information
- `card-stack`: Swipeable or stacked information cards
- `liquid-glass-card`: Glassmorphic dynamic card with blurred refraction

### Text Effects:
- `dynamic-text`, `glitch-text`, `marker-text`, `split-flap-text`, `type-writer`, `swoosh-text`

### Dynamic Backgrounds:
- `background-paths`: Ambient animated SVG line trajectories
- `caustics-background`: Fluid water light reflection effect
- `flow-field`: Canvas particulate vectors
- `topo-background`: Topographic vector contour lines

## Integration Guidelines

1. **Accessibility**: Ensure keyboard navigation (`Tab`, `Enter`, `Escape`) works across interactive components like drawers, dials, and confirmation buttons.
2. **Motion Preference**: Always support `prefers-reduced-motion` for background simulations and intensive particle animations.
3. **Tailwind Cohesion**: Match the component colors and radius tokens to the host application's `globals.css` theme variables.
