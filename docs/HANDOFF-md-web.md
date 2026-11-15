# HANDOFF — MysteryD web (md-web)

Last updated: 2026-11-15, after v8 operator notes (MW-16).
Read this first: sections 0 and 1. Everything else is reference.

## 0. Read this first

The site is LIVE and current. v8 (operator notes O1–O3, MW-16) is deployed and verified on both GitHub Pages URLs. Nothing is mid-flight in the code. What is NOT done:

- Jira MW-16 is In Progress awaiting operator close-out (Form A rule: only the user closes a round). MW-7, MW-15, MW-11/12/13 closed by operator 2026-11-15.
- MW-14 (Backlog): revive featured finding/case study + client quote once real customer material exists.
- MW-17 (Backlog): revive File exchange section once real .REP case files exist (hidden in v8, markup kept).
- Backlog: MW-5 Coolify hosting, MW-6 real `/api/intake` backend.
- "q6." from the original brief was never clarified by the user.

If you read only one section, read section 3 (hard rules). Breaking any of them is a regression, not a style choice.

## 1. What this project is

MysteryD: a noir "case-file" website for a QA and adversarial-testing studio (Los Angeles, est. 2011). Aged-paper aesthetic, typewriter display type, original drifting sigils drawn on canvas. One static HTML page, five sections per Brief v8.1, intake form as the primary conversion.

Repo: `/Users/jolonbankey/Documents/aaa-Agents/hermes/md-web` (branch `main`).
Remotes (token-free URLs; credentials come from the environment):
- `origin` → https://github.com/jb-bz/mysteryd-site.git
- `pages-root` → https://github.com/jb-bz/jb-bz.github.io.git

Live URLs (both serve the same tree):
- https://jb-bz.github.io
- https://jb-bz.github.io/mysteryd-site/

Jira board: https://mysteryd.atlassian.net/jira/software/c/projects/MW/boards/46
Project MW ("Md-www"), epic MW-1. cloudId `83f7c6e2-8ac4-4fc9-b4a5-5ffc742c782d`.
Transitions: 11 Backlog / 21 Selected / 31 In Progress / 41 Done.
REST: `https://api.atlassian.com/ex/jira/{cloudId}/rest/api/3/...`, Bearer token from `~/.hermes/mcp-tokens/atlassian.json` (recursive `access_token` lookup). Never echo or commit tokens.

## 2. Current state (verified 2026-11-15)

HEAD is the v8 operator-notes commit, pushed to both remotes. Prior releases: `e11bc6a` (v7, which also carried v6 `b4f0921`), `9d6584e` (v5), `e4db6ad` (v4).

Files: `index.html`, `styles.css`, `intake.js` (form logic), `atmosphere.js` (sigil canvas), `serve.py` (local static server), `tests/test_v4.py` + `tests/test_v5.py` + `tests/test_v6.py` + `tests/test_v7.py` + `tests/test_v8.py` (63 static contract tests), `assets/fonts/` (Special Elite, Source Sans 3 regular + italic, OFL.txt), `docs/`, `sparc/`.

v8 shipped operator notes (MW-16):
- Wordmark is exactly 1.25× the headline at every width: base clamp(1.875rem, 9.625vw, 4.375rem); ≥1024 clamp(2.5rem, 4vw, 3.28125rem); ≥1440 3.4375rem (55px vs 44px headline). Stamp styling kept (double frame, rotate(-2deg), red-deep). Measured ratio 1.25 at 320/390/1440.
- File exchange section hidden via `hidden` attribute — markup + CSS kept for revival (MW-17). Both Evidence nav links removed; visible folios now 01–04 (FAQ renumbered 05→04; hidden exchange keeps data-folio 04 + revival comment).
- "Case notes" renamed "FAQ" (h2#notes-title); section id `notes` and nav anchors unchanged.

v7 shipped brand (MW-15):
- Intake form heading "OPEN A CASE" enlarged + bold: clamp(1.375rem, 4vw, 1.875rem), weight 700, green; FORM 01 stays small/faint; dotted leader kept.
- MysteryD wordmark is now a case-file rubber stamp: double 3px frame, rotate(-2deg), red-deep ink, hover full red; clamp(2.25rem, 10vw, 4.5rem) base + 4.5rem desktop — larger than the CTA headline at 320/390/1440 (36/39/72px vs 24.6/30/44px). Still links `#intake`.

v6 shipped content (MW-7):
- Contact channel is form-only: Contact row links `#intake` with explanation; no email/mailto anywhere; form-failure copy says "Try again in a moment."
- Hours: `24/7 · a person replies within 24 hours`; all six "business day" promises now "24 hours".
- Featured finding block and client pull-quote removed (no fabricated content). Files table + honest pending row kept. Revival tracked in MW-14.

v5 shipped content:
- Headline: "We find / what's wrong / before your users do." — red accent + drawn underline on "what's wrong", ink caret on baseline. Three single lines at 390px (headline font-size clamp(1.5rem, 7.7vw, 3.5rem)).
- All six form placeholders italic instructions ("Tell us who is opening the case." etc.); typed input upright. Errors all "Required."
- Services index: 8 entries. 05 Accessibility scan (WCAG 2.1/2.2, selectable granularity, levels A/AA/AAA), 06 Penetration testing (authorized scope, findings + results as case file), 07 Reports and evidence, 08 Open a case CTA.
- "OPEN A CASE / FORM 01" eyebrow sits above the form (inside `.intake-formwrap`), not on the CTA.
- Font stack: Special Elite (display + typewriter) + Source Sans 3 (body, italic variable) + system fallbacks. Rye and Anton fully removed (faces, tokens, files).
- Deadline select: In 48 hours (rush charge applies) / 1 week / 2 weeks / Negotiable (default). Budget: only "Undecided (scope first)".

Verification battery (all green at v8):
- `python3 -m unittest discover -s tests` → 63/63 OK.
- `node --check intake.js && node --check atmosphere.js` → clean.
- Vision pass at 390×844 and 1440×900 (hero + services): no overflow/collision.
- Reduced-motion: 0 animations, headline visible, sigil field hidden per CSS.
- no-JS: headline + 8 form fields visible.
- Form flow: empty submit focuses first invalid; filled submit shows "Case file opened." + FILED stamp (confirms on ok OR 404/405/501 from `/api/intake`).
- impeccable detect: 0 anti-patterns (1 advisory: intentional ruled-paper texture — keep it).

Jira state: MW-1 In Progress (epic); MW-2/3/4/8/9/10 Done; MW-5/6 Backlog; MW-7 Done (operator closed 2026-11-15); MW-11/12/13 Done (operator closed 2026-11-15); MW-14 Backlog (revive finding + quote); MW-15 Done (operator closed 2026-11-15); MW-16 In Progress (v8 live, awaiting operator close-out); MW-17 Backlog (revive File exchange when real .REP files exist).

Docs map: `docs/sparc-v4-intake.md` (v4 spec), `docs/sparc-v5-notes.md` (v5 spec), `docs/sparc-v6-content.md` (v6 spec), `docs/sparc-v7-brand.md` (v7 spec), `docs/sparc-v8-notes.md` (v8 spec), `docs/sigil-briefs.md` (16 original glyph briefs), `sparc/STATUS.md` (task table), `sparc/phase-reports.md` (RED/GREEN + defect log), `sparc/tasks.md`, `IDEA.md`, `PRODUCT.md`. Brief v8.1 source: `~/.hermes/attachments/pasted_content_2026-11-14_09-27-12-491_022e31.txt`.

## 3. Hard rules (never break)

1. NEVER use Symbolikon symbols/artwork — no embedding, tracing, shipping, licensing, or swap-in, ever. All sigils are 100% original stroke-path drawings in `atmosphere.js` `GLYPHS`. Lovecraft entity names + public-domain literary descriptions are allowed as creative basis only (see `docs/sigil-briefs.md`). `/tmp/yig.png` and `/tmp/eldersign.png` are prohibited reference images. The QA gallery `glyph-gallery.html` lives in scratch, never in the repo.
2. SPARC methodology for development: ticket first (Jira MW), spec in docs/, RED contract tests before implementation, GREEN, verify in a real browser at 390 and 1440, deploy, mirror results to Jira + sparc/STATUS.md. Load skills `sparc-autonomous-coding` and `jira-tasks` via skill_view before relying on them.
3. Form A: a round stays "awaiting verification" until the user confirms live or explicitly authorizes close-out. Do not self-close tickets.
4. Stack: one static HTML + CSS + vanilla JS. No framework, no build step, no external JS. Self-hosted fonts only. Mobile-first 390×844; no horizontal scroll at 320px+; 44px touch targets. Motion honors prefers-reduced-motion and no-JS; one rAF loop, paused off-tab.
5. No Cloudflare, no tunnels (both were banned/killed earlier). GitHub Pages is the deploy target; Coolify is a backlog item (MW-5), not a blocker.
6. Credentials: never echo, commit, or zip them. Secret-scan before every commit (`grep -rniE "ghp_|github_pat|sk-|Bearer |access_token|password"` over shipped files). GitHub env tokens: GITHUB_SPARQ, GITHUB_SPARQR_RELEASES. Atlassian OAuth: `~/.hermes/mcp-tokens/atlassian.json`.
7. URL sharing: the user is often on a phone client. Give clickable plain-text URLs on their own line — never wrapped in `**` or backticks.
8. Docs live in `md-web/docs/` AND are mirrored to Jira. Keep both in sync each round.
9. Brief v8.1 governs sections; user rulings q1–q4 govern layout/fonts (desktop got a new layout; brief is a factor, not a straitjacket).

## 4. Deploy recipe (proven twice)

1. Secret scan (rule 6), then `git add -A && git commit`.
2. `git push origin main && git push pages-root main`.
3. Poll live (~40–90s propagation): curl both URLs, check a NEW content marker. Marker must be tag-aware: flatten HTML (`re.sub(r'<[^>]+>',' ',h)`) before substring checks — "We find what's wrong" spans tags and a raw grep misses it.
4. Verify asset changes too (e.g. removed font returns 404).
5. Live DOM check in browser at 390: headline text, line heights, eyebrow gap, placeholder style, entry count, loaded font families, scrollWidth.
6. Comment deploy results on each ticket + epic; update sparc/STATUS.md; leave tickets In Progress until operator closes.

## 5. Browser verification notes (harness traps)

- Session name `mdweb` in browser_exec. `ensure_real_tab()` recovers stale tabs; the daemon occasionally times out — retry in smaller steps.
- Apply `Emulation.setDeviceMetricsOverride` AFTER `new_tab` and again after any tab change, then `Page.reload` (override is lost on new tabs; a check once measured 789px instead of 390).
- `Emulation.setScriptExecutionDisabled` takes `value=True/False` (raw CDP), not `disabled=`.
- Reduced-motion: `Emulation.setEmulatedMedia` features `[{'name':'prefers-reduced-motion','value':'reduce'}]` before reload.
- Screenshots: `Page.captureScreenshot` + base64 decode to a file, then vision_analyze. Measure geometry with DOM rects, not scaled screenshots.
- Local server: `python3 serve.py` → http://127.0.0.1:52423/index.html.

## 6. Known pitfalls already fixed (do not reintroduce)

- `.hl-wrong { display:inline-block; line-height:1 }` — inline em made the underline strike the next line.
- `.hl-stop { vertical-align: baseline }` — caret floated above baseline otherwise.
- `.case-opened:focus` themed green outline — default blue focus ring clashed with the palette.
- Status strip left-aligned below 599px (was clipped at 390).
- `paintStatic()` in atmosphere start/stop/resize — reduced-motion previously left the canvas blank.
- Headline clamp 7.7vw — Special Elite is wider than Anton; 8vw+ wraps line 3 at 390.
- `tests/__pycache__` is gitignored; if it ever gets staged, `git rm --cached` before push.
- unittest piped to tail exits 0 even on failure — read the printed counts, not the exit code.

## 7. Backlog / next candidates

- MW-5: Coolify hosting (user wants it eventually; don't block on it).
- MW-6: real `/api/intake` endpoint (form currently confirms on 404/405/501 as a stub).
- MW-14: revive featured finding/case study + client quote once real customer reports/quotes exist (removed in v6 to avoid fabricated content).
- MW-17: revive File exchange section once real .REP case files exist (hidden in v8; remove `hidden`, re-add Evidence nav links, renumber FAQ back to 05).
- Operator close-out of MW-16 when the user confirms the live v8 round. (MW-7, MW-15, MW-11/12/13 closed 2026-11-15.)
- "q6." from the brief: never clarified; ask if it becomes relevant.

## 8. Palette + type tokens (current)

Paper #f1e7d3, ink #1b1b1b, red #B23A2A, green #1E6E5A.
`--font-display` / `--font-type`: 'Special Elite', 'Courier New', monospace. Body: Source Sans 3 (+ system fallbacks). `--font-head` was deleted in v5 — do not resurrect it.
Sigils: stroke 1.6px, 36–68px, round caps, no fills; 16 entities; random glyph AND motion, re-rolled on every edge wrap.

Source URLs: none — all claims measured against the repo tree at 9d6584e, live Pages URLs, and Jira REST on 2026-11-15.