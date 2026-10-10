---
name: Career-Ops Studio
description: Neo-brutalist architectural career operations engine and dual-engine diff studio
colors:
  primary: "#1414b8"
  primary-hover: "#1e1eb8"
  surface-canvas: "#fafafa"
  surface-card: "#ffffff"
  surface-subtle: "#f4f4f5"
  highlight-human: "#d9f99d"
  highlight-border: "#bef264"
  strikethrough-ai: "#e11d48"
  text-primary: "#09090b"
  text-muted: "#71717a"
  verified-emerald: "#059669"
  border-architect: "#1414b8"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontWeight: 900
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "15px"
    lineHeight: "1.75"
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "12px"
rounded:
  none: "0px"
  sm: "3px"
  md: "6px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "14px 28px"
  fact-capsule:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
---

# Design System: Career-Ops Studio

## Overview

**Creative North Star: "The Master Architectural Blueprint"**

Career-Ops Studio merges the raw, structural authority of architectural blueprints with the surgical, side-by-side diffing clarity of high-performance text editors. It rejects the mushy, pastel-tinted sameness of consumer AI applications in favor of high-contrast conviction: stark white cards set against a warm zinc paper grid, bound by uncompromising 3px solid cobalt blue borders and sharp 6px hard geometric drop shadows.

The experience is strictly task-oriented (**Operate Mode**). Every visual device serves cognitive clarity: corporate AI filler is struck through with crisp crimson lines; high-density, humanized accomplishments are illuminated with natural lime-green inline highlights; and verifiable metrics are secured in tactile, locked capsule badges.

**Key Characteristics:**
- **Architectural Neo-Brutalism**: Heavy 3px cobalt borders, 6px unblurred drop shadows, and subtle 24px blueprint graph grids.
- **Natural Inline Flow**: Diff highlights wrap smoothly across prose without awkward block wrapping, orphan commas, or ragged text gaps.
- **High-Density Typography**: Uppercase black display headings paired with readable 15px body prose and precision JetBrains Mono data labels.
- **Three-Act Narrative Structure**: A guided, purposeful progression (Intake & Lock $\rightarrow$ Studio Canvas $\rightarrow$ Audit & Export).

---

## Colors

The palette is restrained, high-contrast, and deeply functional. Cobalt blue carries the structural architecture, while semantic highlights direct editorial attention.

### Primary
- **Architect Cobalt** (`#1414b8`): The defining structural color. Used for all 3px container borders, hard drop shadows, active pipeline badges, and primary action buttons.
- **Cobalt Deep Hover** (`#1e1eb8`): Active and hover state for primary interactive elements.

### Functional Highlights
- **Human Lime Highlight** (`#d9f99d`): Illuminates rewritten action verbs and concise human prose.
- **AI Strikethrough Crimson** (`#e11d48`): Clean 1.5px strike through deleted corporate filler.
- **Verified Emerald** (`#059669`): Signals 100% factual lock, passing scores, and ATS keyword matches.

### Neutral
- **Paper Canvas** (`#fafafa`): Warm off-white canvas with subtle 4% opacity cobalt grid lines.
- **Card Surface** (`#ffffff`): Crisp white interior for cards, inputs, and diff panels.
- **Pitch Black** (`#09090b`): High-contrast display headlines and primary body text.
- **Muted Zinc** (`#71717a`): Secondary metadata, timestamps, and discarded original text.

### Named Rules
**The Hard Shadow Rule.** Drop shadows are strictly geometric offsets (`box-shadow: 6px 6px 0px #1414b8`), never blurred. Depth represents structural layering, not ambient light.

**The Inline Highlight Rule.** Highlighted wording must use pure inline styling (`box-decoration-break: clone; display: inline;`). Multi-word highlights must never be rendered as atomic `inline-block` pills, ensuring text wraps naturally without dangling punctuation.

---

## Typography

**Display Font:** `Inter` (with system sans-serif fallback)  
**Body Font:** `Inter` (with system sans-serif fallback)  
**Label / Mono Font:** `JetBrains Mono` (with monospace fallback)  

### Hierarchy
- **Display** (Black 900, 24px–32px, tracking -0.03em, uppercase): App branding and primary milestone headers.
- **Headline** (Black 900, 18px–20px, uppercase): Section headers and scorecard titles.
- **Body** (Regular 400 / Medium 500, 15px, line-height 1.75 / leading-7): Resume bullet text and draft comparisons. Optimized for 65–75 character measures.
- **Mono Label** (Bold 700 / Medium 500, 10px–12px, uppercase): Invariant tags, dimension scores, status pills, and diff metadata.

### Named Rules
**The Left-Justified Rhythm Rule.** All comparative prose must be strictly left-aligned (`text-left`) with matching `leading-7` vertical rhythm across both Draft and Rewrite columns to allow instantaneous eye-tracking comparison.

---

## Layout

The interface follows a **Three-Act Pipeline Stepper** anchored to an asymmetric **70/30 Studio Canvas**:
* **Container**: Max width of `1440px` with responsive padding (`px-4 sm:px-6 lg:px-8`).
* **Left Stage (70% Width / 8 Columns)**: The Diff Laboratory. Provides generous ~520px width per card, preventing premature word wraps and awkward hyphenation.
* **Right Panel (30% Width / 4 Columns)**: Sticky Quality Gate sidebar housing the 50-point Anti-Slop scorecard, ATS keyword matrix, and export CTA.

---

## Elevation & Depth

Surfaces use hard, structural elevation:
- **Card Containers**: `box-shadow: 6px 6px 0px #1414b8; border: 3px solid #1414b8;`
- **Badges & Small Controls**: `box-shadow: 3px 3px 0px #1414b8; border: 2px solid #1414b8;`
- **Fact Capsules**: `box-shadow: 2px 2px 0px #1414b8; border: 2px solid #1414b8;`

---

## Shapes

- **Containers & Cards**: Sharp geometric rectangles (`rounded-none` to `rounded-sm: 3px`).
- **Fact Capsules**: Full pill capsules (`rounded-full: 9999px`) to distinguish locked factual data from structural content boxes.

---

## Components

### 1. The Dual-Card Diff Container
- **Structure**: Side-by-side grid of `01 Original Draft` and `02 Career-Ops Rewrite`.
- **Styling**: White card with 3px cobalt border and 6px hard shadow.
- **Body**: Bulleted lists (`•`) with matching line heights, red strikethrough for AI tells, and lime inline highlights for active human wording.

### 2. The `✓ FACTS KEPT` Capsule Bar
- **Location**: Pinned directly to the bottom of the Diff Container.
- **Content**: Clean capsule badges locking metrics (`[$1.4M 🔒]`, `[40% latency 🔒]`, `[Kubernetes HPA 🔒]`).
- **Border**: 2px cobalt with 2px hard shadow and bold monospace type.

### 3. The Anti-Slop Quality Gate Scorecard
- **Header**: Cobalt status pill (`QUALITY GATE · V1.0 STABLE`).
- **Score**: Massive bold cobalt `42/50` score with blue progress fill bar.
- **5 Dimension Rows**: Directness (9/10), Rhythm (8/10), Trust (10/10), Authenticity (8/10), Density (8/10).
- **ATS Match Matrix**: High-contrast skill vector chips (green for matched, amber for missing).

### 4. The Three-Act Pipeline Stepper
- Horizontal progress bar in the top navigation:
  - `Act 01: Intake & Lock` (Checked / Zinc)
  - `Act 02: Studio Canvas` (Active / Cobalt / Hard Shadow)
  - `Act 03: Audit & Export` (Upcoming / White)

---

## Do's and Don'ts

### Do:
- **Do** use `box-decoration-break: clone; display: inline;` for all text highlights so multi-line phrases wrap naturally.
- **Do** attach punctuation immediately to highlighted phrases without leading spaces.
- **Do** maintain a strict 3px solid `#1414b8` border with `6px 6px 0px #1414b8` hard drop shadows on primary containers.
- **Do** give diff cards at least 500px of horizontal breathing room to preserve executive resume reading rhythm.

### Don't:
- **Don't** use `display: inline-block` on text highlights; it breaks natural sentence flow and isolates punctuation.
- **Don't** introduce blurred or semi-transparent drop shadows; all shadows must be 100% hard geometric offsets.
- **Don't** use dark mode or cyberpunk gradients; the canvas is strictly a warm architectural paper blueprint (`#fafafa`).
- **Don't** squeeze diff columns into three equal widths; the diff is the hero and requires 70% of the viewport.
