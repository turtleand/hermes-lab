# AGENTS.md — hermes-lab

See `CLAUDE.md` for content schema and publishing checks.

## Scope

Applies only to `hermes-lab/`.

## Ecosystem role

- Hermes Lab is the Hermes-specific proof-of-practice layer of Turtleand.
- Its primary job is to document real Hermes Agent usage: configuration, messaging gateways, voice workflows, scheduling, tools, skills, reliability, and operational tradeoffs.
- It should remain concrete and deployment-oriented rather than becoming a generic AI blog.

## Project summary

- Stack: Astro + MDX
- Status: Scaffolded
- Primary content: Hermes Agent field notes, setup guides, troubleshooting notes, and practical platform workflows

## Workflow

1. Read `CLAUDE.md` before changing content structure or deployment setup.
2. Prefer edits under `src/`, `public/`, and `scripts/`.
3. Do not modify `dist/` unless explicitly asked.
4. Treat `netlify.toml` and operational config as deployment-sensitive files; change them only when the task requires it.

## Content guidance

- Favor reproducible fixes and platform constraints over abstract commentary.
- Preserve topics around voice-first workflows, Telegram delivery, TTS/STT, gateway routing, skills, cron jobs, tool use, and long-running agent workflows.
- Use this project to show how Hermes becomes a serious reasoning companion when operational details are handled well.

## Cross-project boundaries

- Route staged beginner-to-builder teaching content to `ai-lab/`.
- Route lower-level engineering craft and implementation notes to `build/`.
- Route compact doctrine and reusable principles to `handbook/`.
- Route ecosystem framing and visitor routing to `portal/`.
- Route general agent-systems material not specific to Hermes to `openclaw/`.

## Commands

- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
