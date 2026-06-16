# AGENTS.md - hermes-lab

See `CLAUDE.md` for content schema and publishing checks. This file gives repository-level guidance for Codex automatic PR reviews and other AI agents.

## Scope

Applies only to `hermes-lab/`.

## Ecosystem role

- Hermes Lab is the Hermes-specific field-notes and proof-of-practice layer of Turtleand.
- Its job is to document real Hermes Agent usage, configuration, gateway behavior, voice workflows, cron jobs, tools, skills, reliability, and operational trade-offs.
- Keep Hermes Lab concrete, reproducible, and operations-focused rather than generic AI commentary.
- Use official Hermes Agent docs as authoritative when writing setup or troubleshooting content.
- Route staged beginner teaching to `ai-lab/`, lower-level engineering craft to `build/`, compact doctrine to `handbook/`, ecosystem routing to `portal/`, and general agent-systems material not specific to Hermes to `openclaw-lab/`.

## Project summary

- Stack: Astro + MDX
- Status: Scaffolded
- Primary content: Hermes Agent field notes, setup guides, troubleshooting notes, and practical platform workflows

## Workflow

1. Read `CLAUDE.md` before changing content structure or deployment setup.
2. Prefer edits under `src/`, `public/`, and `scripts/`.
3. Do not modify `dist/` unless explicitly asked.
4. Treat `netlify.toml` and operational config as deployment-sensitive files. Change them only when the task requires it.

## Public-safety review

Reject changes that expose secrets, credentials, private gateway details, internal routing, sensitive paths, private infrastructure details, specific vulnerabilities, or operational weaknesses. Safe public lessons are allowed when they describe general patterns, architecture trade-offs, defensive principles, or non-sensitive implementation choices.

Keep private things private. Share learnings, not exposure.

## Content quality review

- Favor reproducible operational notes over generic AI commentary.
- Check setup commands, configuration claims, gateway behavior, voice workflows, cron behavior, tool usage, and skill references against real evidence or official docs.
- Avoid exposing tokens, private routing, private operational gaps, or fragile infrastructure details.
- Preserve Turtleand voice: calm, precise, direct, reflective when useful, practical when needed.
- Do not introduce em dashes in public writing.
- Keep humans responsible for direction, judgment, taste, ethics, and consequences.

## Repository integrity review

- Keep changes focused to the branch purpose.
- Do not silently modify generated or build output unless the repo explicitly tracks it or the change requires regeneration.
- Keep `llms.txt`, `llms-full.txt`, sitemaps, indexes, routes, and field-note metadata aligned when content changes require it.
- Run local validation before PR creation.

## PR review checklist

Codex and other agents should check:

- Does the change strengthen Hermes Lab as a Hermes-specific proof-of-practice surface?
- Are setup and troubleshooting claims grounded in official docs or verified behavior?
- Is anything private, unsafe, or operationally sensitive exposed?
- Are routes, builds, generated files, metadata, and indexes still correct?
- Is the diff small, coherent, and free from unrelated cleanup?

## Commands

- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
