---
name: dependabot-pr-manager
description: Review, repair, validate, and merge GitHub Dependabot PRs one at a time across Turtleand repositories. Use when a user asks to clear a Dependabot queue, resolve dependency-update conflicts, verify patch, minor, or major upgrades, protect styles and behavior with baseline and browser comparisons, or establish a repeatable dependency-update merge process.
---

# Dependabot PR Manager

Safely move a Dependabot queue from oldest open PR to empty. Prove that each prospective merge preserves the repository's build, runtime behavior, routes, interactions, and visual contracts before merging its exact head SHA.

## Operating rules

- Read the target repository's `AGENTS.md`, `CLAUDE.md`, and relevant project guidance first.
- Preserve the user's active checkout and unrelated work. Use a clean temporary clone or detached worktree.
- Process one PR at a time. Refresh the default branch after every merge before touching the next PR.
- Validate the prospective merge result, not only the bot's stale head branch.
- Treat semver as risk input, not proof of safety. Patch updates can still break a runtime.
- Keep repairs limited to dependency manifests, lockfiles, and the smallest required compatibility configuration.
- Never force-push a Dependabot branch after concurrent bot activity. Fetch the new head, compare trees, and validate the exact replacement SHA.
- Merge only the exact head SHA that passed local checks, GitHub checks, and deploy-preview verification.

## 1. Inventory the queue

1. Resolve the repository, default branch, authentication state, and dirty working-tree state.
2. List open PRs authored by `app/dependabot`, ordered oldest first unless the user specifies another order.
3. Record each PR's number, URL, title, head SHA, base SHA, mergeability, changed files, checks, and update class.
4. Inspect the release notes and dependency role. Identify peer packages, coupled runtimes, framework plugins, build tools, deployment packages, and security-sensitive dependencies.
5. Reject unexpected source, workflow, generated, credential, or public-content changes from the dependency-only path.

Under standing "merge the safe ones" authority, treat only patch dependency updates as merge candidates. Hold minor or major updates, GitHub Actions changes, and auth, database, deployment, runtime, framework, or security-sensitive jumps for explicit review unless the user's request clearly authorizes them.

## 2. Build the prospective merge result

1. Fetch the current default branch and PR head into the isolated checkout.
2. Merge the current default branch into the PR validation branch.
3. If conflicts occur, inspect stages with:

   ```bash
   git ls-files -u
   git show :1:path/to/file
   git show :2:path/to/file
   git show :3:path/to/file
   ```

4. Resolve the manifest first. Preserve both the current default branch's dependency state and the PR's intended update.
5. Regenerate lockfiles with the package manager instead of hand-editing large generated sections.
6. Confirm that no conflict markers or unmerged entries remain.

## 3. Establish baseline evidence

Run the same battery on a clean checkout of the current default branch:

- Clean locked install under a runtime supported by the repository's dependencies.
- Type-check or compile step when present.
- Production build.
- Lint.
- Repository tests when present.
- `git diff --check`.
- Package-manager audit captured as structured output.
- Production-preview browser smoke test.
- Compiled CSS inventory and screenshots for visual surfaces.

Do not call a candidate broken when the same failure exists on the baseline. Record baseline warnings separately. A baseline error weakens evidence and blocks strict automatic merging until the risk is understood.

## 4. Validate the candidate

Run the identical clean-install and validation battery on the prospective merge result. Do not reuse the baseline's `node_modules`.

For npm repositories, prefer:

```bash
npm ci --no-audit --no-fund
npm run build
npm run lint
npm test
npm audit --json
```

Run only scripts that exist. A missing optional script is not a failure.

Compare audits as a delta:

```bash
node "<skill-dir>/scripts/compare-npm-audits.mjs" baseline-audit.json candidate-audit.json
```

Require no new vulnerability, no severity increase, and no increase in high or critical findings. Existing findings must be reported, not silently treated as green.

Compare compiled style content when both builds emit CSS:

```bash
node "<skill-dir>/scripts/compare-built-styles.mjs" baseline-dist candidate-dist
```

Identical compiled CSS is strong evidence for dependency-only updates. Changed CSS requires focused visual review and an explanation before merge.

## 5. Prove runtime and visual preservation

Start the production build on a unique localhost port. Verify a repository-specific title or content marker so a port collision cannot masquerade as success.

Check every important route at desktop and narrow-mobile sizes:

- Load direct URLs and client-side navigation paths.
- Assert expected headings, links, canvases, controls, or other route contracts.
- Confirm no browser console errors.
- Confirm no broken images or media.
- Confirm no horizontal overflow.
- Capture viewport screenshots after a stable render state.
- Exercise the most important interaction and compare its settled result with baseline.
- Test forward navigation and return navigation for routing-library updates.

Use 1440 by 900 and 390 by 844 when the repository has no stronger device contract. For animated, canvas, randomized, or time-based surfaces, compare stable DOM contracts, layout metrics, compiled CSS, and screenshots rather than demanding raw pixel identity.

A successful build does not prove a working app. Explicitly check coupled runtime versions such as `react` with `react-dom`, framework cores with renderers, and plugins with their host framework. A mismatched peer pair can compile cleanly while the browser renders only fallback HTML.

## 6. Repair narrowly and rerun everything

When the candidate fails:

1. Identify whether the failure is caused by the dependency update, a stale PR base, or a pre-existing baseline issue.
2. Apply the smallest dependency or compatibility repair.
3. Keep paired runtime packages on compatible releases.
4. Regenerate the lockfile.
5. Rerun the clean install, build, lint, tests, audit delta, style comparison, browser routes, screenshots, interactions, and console check.
6. Commit and push only after the repaired result passes.

## 7. Verify GitHub and deploy preview

1. Re-read PR metadata after any push or Dependabot rebase.
2. Wait for required GitHub checks to finish.
3. Open the deploy preview and verify representative routes, direct nested-route loading, responsive layout, and browser console state.
4. Inspect unresolved review threads.
5. If the remote head changes, fetch it and compare the full tree with the validated result. Never assume equivalence from the commit message.

## 8. Merge and advance

1. Squash-merge the exact validated head SHA.
2. Verify the PR reports `merged=true` and record the merge commit.
3. Poll post-merge checks on the merge commit when the repository provides them.
4. Fetch the new default branch.
5. Rebuild the next PR's prospective merge result from that new baseline.
6. Continue until a fresh Dependabot search returns no open PRs.

## Hard blockers

Do not merge when any of these remains:

- Unexpected changed files or public-safety findings.
- Unresolved conflicts, dirty merge state, or conflict markers.
- Candidate-only build, lint, test, type, or runtime failures.
- New or worsened audit findings.
- Unexplained compiled-style changes or visual drift.
- Browser console errors, blank fallback rendering, broken media, or overflow.
- Broken routes, navigation, or critical interactions.
- Failing required GitHub checks or deploy preview.
- A head SHA different from the one that passed validation.

## Final evidence

Report:

- PR URLs, validated head SHAs, and merge commits.
- Conflicts and compatibility repairs.
- Install, build, lint, test, and audit-delta results.
- Baseline limitations and unchanged warnings.
- Compiled-style comparison result.
- Desktop and mobile route coverage.
- Interaction and console-error results.
- Deploy-preview status.
- Post-merge status and the final empty-queue check.
