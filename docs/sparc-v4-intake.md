# SPARC v4 — Intake conversion pass (Spec + Design + Architecture)

Inline SPARC run (single agent, operator in chat). Discipline: six phases, RED-then-GREEN, story points, per-task phase reports in `sparc/phase-reports.md`, live board in `sparc/STATUS.md`. Jira mirror: project MW, epic MW-1.

## Specification

### Goal
Raise the intake form's conversion pull: a CTA-grade headline, form fields that instruct instead of showing fake sample data, honest deadline/budget options, and a randomized Lovecraftian sigil field drawn from the entity catalog the operator supplied (symbolikon.com/meanings/lovecraft-symbols-meanings/).

### User stories
- US-1: As a product lead landing on the site, I want a headline that tells me what MysteryD does for me and pushes me to open a case, so that I start the form instead of bouncing.
- US-2: As a first-time form filler, I want each empty field to tell me what to write (not show a stranger's sample data), so that I never mistake placeholder text for a prefilled value.
- US-3: As a buyer with a timeline, I want deadline options that match real engagements (48h rush, 1 week, 2 weeks, negotiable) and a budget field that does not force a premature number, so that filing the case feels low-risk.
- US-4: As a visitor who liked the moving sigils, I want varied mythos glyphs with randomized motion, so that the atmosphere stays alive and uncanny.

### Acceptance Criteria
- Given the live page, When the headline renders, Then it contains no "We find the thing that is wrong with your product" copy and reads as a call to open a case.
- Given the intake form, When any required field is empty, Then its placeholder is an instruction sentence and none of the old sample values (Alex Rivers, alex@rivers.co, Rivers Labs, Atlas, Web iOS Android, upload-error example) appear anywhere in the form.
- Given the deadline select, When opened, Then it offers exactly: In 48 hours (rush charge applies) / 1 week / 2 weeks / Negotiable.
- Given the budget select, When opened, Then its only option is Undecided (scope first).
- Given the sigil canvas, When observed over time, Then multiple distinct mythos glyphs appear and their spin/drift differ per sigil; reduced-motion and no-JS fallbacks remain static/absent.
- Given 320–1440px viewports, Then no horizontal overflow, no clipped controls, form still submits and confirms.

### Success Metrics
- Static contract suite: 100% pass (tests/test_v4.py).
- impeccable detect: 0 findings on files and served URL.
- Live deploy: root + assets 200 on https://jb-bz.github.io.
- Placeholder confusion: zero sample-data strings in shipped form markup.

### Constraints
- One static HTML + CSS + vanilla JS; no framework, no external JS, self-hosted fonts.
- Operator ruling: NEVER use Symbolikon artwork. Ship ORIGINAL line-art
  interpretations of the public-domain Mythos entities (docs/sigil-briefs.md);
  names + literary descriptions are the creative basis only. No swap-in path.
- Motion honors prefers-reduced-motion; one rAF loop, paused off-tab.
- Intake POSTs /api/intake; confirms on ok or 404/405/501 (static-host safe).

### Spike tasks
- [x] Symbolikon licensing: download page shows Private $4 / Commercial $9 per symbol → original-interpretation route (recorded above).
- [x] Glyph rendering cost: 16 stroke-path glyphs × ≤11 sigils per frame is trivially within budget at DPR≤2.

### Out of scope
- Real /api/intake backend (MW-6), Coolify deploy (MW-5), [pending] content (MW-7).

## Design

### Headline (implemented option A; alternates presented to operator in chat)
Three lines, Anton, red underline accent preserved on the key phrase:
1. "Something is wrong."
2. "We find it" (accent em)
3. "before your users do."
Deck and form unchanged in position; headline now points at the visitor's risk and the desk's action.

### Field placeholders (instruction copy, sentence case, trailing period)
- name: "Tell us who is opening the case."
- email: "Where the findings should reach you."
- organization: "The company the case is opened for."
- product: "Name the product under investigation."
- platforms: "Every place the product runs."
- problem: "Describe the symptom in your own words."
Errors simplify to "Required." (the instruction now lives in the placeholder); email format error stays explicit.

### Selects
- Deadline: 48h rush / 1 week / 2 weeks / Negotiable (default Negotiable — least commitment).
- Budget: single option "Undecided (scope first)".

### Sigil field
16 original stroke glyphs keyed to the catalog entities: Elder Sign, Yig, Yellow Sign, Cthulhu, Dagon, Nyarlathotep, Hastur, Yog-Sothoth, Azathoth, Atlach-Nacha, Tsathoggua, Ghatanothoa, Nodens, Gloon, Rhan-Tegoth, Y'golonac. Per-sigil randomization: glyph, spin rate AND direction, drift vector (any direction, not only upward), wobble, breathe phase, alpha. Glyph re-rolls when a sigil wraps an edge. Palette/alpha unchanged (viridian/umber ink, 5–12%).

## Architecture
- index.html: headline spans, placeholder attributes, option lists. No structural change.
- atmosphere.js: GLYPHS array of 16 draw(c, r) path functions; drawSigil dispatches on s.glyph; seed() randomizes motion vectors; wrap logic handles all four edges and re-rolls glyph. Single rAF loop unchanged; reduced-motion/no-JS paths unchanged.
- intake.js: error strings only; validation logic unchanged.
- styles.css: no token changes; placeholder styling already ink-faint.
- Tests: tests/test_v4.py (static contract) + browser runtime checks + impeccable detect.
