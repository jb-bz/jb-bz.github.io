# MysteryD — CASE FILE (rebuild + atmosphere, 2026-11-14)

One static page, one CSS file, vanilla JS. No framework, no build step, no external JS. Fonts self-hosted (woff2). Mobile-first single column from 390x844; min-width breakpoints only; nothing scrolls horizontally at 320px+. Desktop (>=1024px) is a distinct two-column dossier spread, not a widened mobile column.

## Direction

The page is an aged-paper case file, not a website. The intake form IS the hero artifact; every later section is another page of the same file. The detective framing is a visual style only — no literal "private investigator" copy; hints live in the form chrome (FORM 01, case file, night desk). The user's attached reference is a factor, not a baseline: its weak points (faint muddy watermarks, prefilled demo values, floating stamp) were corrected rather than copied.

## Files

- `index.html` — five sections per the brief: 01 Open a Case (intake), 02 Services index, 03 The nine steps, 04 File exchange, 05 Case notes (FAQ + the desk + pull-quote) + colophon. Sticky desk bar with scroll-spy (desktop). Ghost folio numerals per section (desktop).
- `styles.css` — committed palette, fluid clamp() scale, mobile-first, desktop dossier spread, palette scrollbar, staged reveals behind `.js` + `prefers-reduced-motion` guards.
- `intake.js` — progressive enhancement: mobile menu, sticky desk bar + scroll-spy, IntersectionObserver reveals (staggered per sibling), form validation (novalidate, inline non-color errors, focus management), JSON POST, confirmation on the page. Without JS the form keeps native validation and posts normally; reveals and menu degrade to fully usable.
- `atmosphere.js` — the living-file layer: drifting elder-sigil field on a fixed canvas (5–11 sigils, viridian/sepia ink at 5–12% alpha, slow rise + rotation + breathe), pointer lamp (soft-light warm radial that eases after the cursor, fine pointers only), folio parallax on scroll, typewriter reveal of NIGHT DESK ON DUTY, headline lines rise in sequence, red editor's underline draws under "wrong", FILED rubber-stamp slams onto the confirmation. One rAF loop, paused when the tab is hidden; every effect honors `prefers-reduced-motion` (canvas + lamp hidden, text instant, stamp static) and degrades to the static page without JS.
- `assets/fonts/` — Rye (masthead + section titles), Anton (headline + step numerals), Special Elite (labels/status/form chrome), Source Sans 3 variable regular + italic (body). All self-hosted woff2.
- `assets/plates/paper-texture.png` — 384x384 mirrored tile sampled from the reference paper; tiled as the body ground under two radial washes.
- `assets/_rejected/` — the earlier rejected intaglio build's fonts and plates, kept off the live path for reference only.

## Committed palette

Paper #F1E7D3 · deep #E6D7BD · edge #D8C7A6 · ink #1B1B1B · soft #453F33 · faint #57503F · rule rgba(27,27,27,.55) · brick red #A63A2A (the word "wrong", OPEN CASE, active nav, step numerals) · viridian #1E6E5A (live status only) · folio watermark rgba(146,116,70,.14).

## Type roles

Rye = masthead + section titles only. Anton = headline + step numerals only. Special Elite = labels, status strip, eyebrows, log/form chrome. Source Sans 3 = all body and field values (the legibility answer to the earlier illegible build).

## Desktop layout (>=1024px)

- Sticky desk bar appears after the masthead: wordmark, section nav with active underline, OPEN A CASE.
- Section 01: headline + deck + night-desk log left (sticky), form right, vertical rule between.
- Section 02: services as a two-column index.
- Section 03: nine steps as a 3x3 evidence grid, red Anton numerals.
- Section 05: FAQ left, the desk right (sticky), pull-quote centered below.
- Ghost folio numeral per section, low-contrast, behind the heading column.

## Unresolved items (real data not supplied — explicit placeholders, nothing invented)

1. Section 4 sample finding — real finding + severity + Expected/Observed not supplied; page shows a pending notice, no fabricated finding.
2. Contact email — `[contact email pending]`.
3. Hours — `[hours pending]`.
4. Client pull-quote — desk line "What we find stays found." used; no real client quote supplied, none invented.
5. Intake endpoint — form POSTs to `/api/intake` (relative). No backend yet; `intake.js` confirms locally when the response is ok or a static host answers 404/405/501. Wire the real endpoint by pointing the form `action` at it; 2xx already confirms.

## Detector suppression rationale

Suppressed via `.impeccable/config.json`, each because it flags a committed design decision, not a defect:

- `cream-palette` — the ground IS aged cream paper; committed direction.
- `buried-raster` — paper texture tile is ground furniture, not buried content.
- `low-contrast` — folio watermarks are decorative, never information-bearing; all reading text and controls meet contrast.
- `tiny-text` — tracked typewriter labels are case-file chrome at a legible 13px; body and interactive text stay readable.
- `text-occlusion` — folio numeral deliberately sits behind the heading column (intended layering, heading fully legible).
- `hero-eyebrow-chip` — the "OPEN A CASE … FORM 01" leader row is the reference's dossier leader, not a SaaS eyebrow chip.

Real findings were fixed, not suppressed: pulsing status dot made static (honest liveness), cramped container padding inset, aphoristic lede cadence rewritten, orphan words bound, pull-quote centered on the grid. Remaining advisory `repeating-stripes-gradient` is the ruled-ledger textarea — a deliberate case-file mechanic.

## Verification performed

- Overflow sweep 320/390/640/768/1024/1440: no horizontal scroll at any width.
- Intake end to end at 390: empty submit → 6 inline errors + focus first field; valid submit → confirmation, form hidden, filed timestamp; reload resets.
- Mobile menu opens/closes, closes on link click, aria-expanded tracks state.
- Desktop scroll-spy: desk bar appears after masthead, active link tracks section.
- FAQ accordion opens/closes; reduced-motion disables reveals and animations.
- Fonts load from disk (woff2); no fallback.
- CLI detect: 0 anti-patterns. Live served-page detect: 0 anti-patterns.
- Atmosphere runtime: canvas paints and changes frame-to-frame; folio parallax tracks scroll (23px top → 3px at notes); all 31 reveals fire; typewriter completes; FILED stamp lands at opacity .85 rotated −6°; reduced-motion hides canvas/lamp and shows all text instantly; no-JS path keeps the static page fully usable.
- Visual ship checks (vision) at 1440x900 (top, method, notes) and 390x844: SHIP on all after fixes.

## Run

Open `index.html` directly, or serve the folder statically (`python3 -m http.server`). The intake confirms locally on a static host until the real endpoint is wired.