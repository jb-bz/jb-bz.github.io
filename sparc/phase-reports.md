# SPARC v4 phase reports — intake conversion pass

Date: 2026-11-15. Board: MW (mysteryd.atlassian.net, board 46). Epic MW-1.

## T1 — CTA headline (MW-8, 2 pts)
- RED: static contract test asserted rejected copy absent, new CTA present. Failed pre-change.
- GREEN: headline now "Something is wrong. / We find it / before your users do." Red accent + underline on "wrong."
- Underline collision defect found at 390px (inline box 68px vs 51px line box). Fixed: `.hl-wrong { display:inline-block; line-height:1 }`, headline line-height 1.06→1.14, underline offset 0.18em→0.06em. Geometry re-measured: 3.3px gap box-to-next-line; vision check PASS (clear air, no contact).
- Alternates B/C/D presented in chat; operator superseded all with v5 copy ("We find what's wrong before your users do.").

## T2 — Intake UX (MW-9, 3 pts)
- All six text placeholders are instructions, not sample data (exact strings in tests/test_v4.py).
- All field errors reduced to "Required."
- Deadline: exactly 4 options — In 48 hours (rush charge applies) / 1 week / 2 weeks / Negotiable (default).
- Budget: single option — Undecided (scope first).
- Browser flow verified: empty submit shows 6 errors + focuses first invalid; filled submit files the case (form hidden, CASE OPENED stamp visible) at 390 and 1440.

## T3 — Original sigil library (MW-10, 5 pts)
- 16 original stroke-path glyphs in atmosphere.js GLYPHS, drawn from public-domain Mythos descriptions (docs/sigil-briefs.md). Zero Symbolikon artwork — operator ruling: never, in any form.
- Random glyph AND random motion per sigil (rollMotion); glyph + motion re-roll on all four edge wraps.
- QA gallery (16 cells): all distinct, readable, none broken — vision PASS.
- Runtime: animated ink pixels change frame-to-frame; reduced-motion paints a static visible field (fixed: start()/stop() previously left canvas blank); live media-toggle both directions verified; resize re-seeds and repaints; tab-hide paints static, tab-show resumes.
- no-JS: headline, form, placeholders, button all visible (screenshots verified).

## T4 — Verify + deploy (2 pts)
- 14/14 static contract tests OK; node --check clean on both JS files.
- impeccable detect: 0 anti-patterns (1 advisory: intentional ruled-paper texture).
- 390×844 and 1440×900 screenshots verified: no overflow, overlap, or clipping; status strip full text at 390 (fixed left-align on mobile).
- Deploy: commit + push origin (mysteryd-site) and pages-root (jb-bz.github.io); live 200 checks.

## Defects found and fixed during verification
1. Red underline struck next headline line at 390 → inline-block + line-height fix (geometry measured, vision PASS).
2. Status strip clipped at 390 → mobile left-align.
3. Reduced-motion canvas blank → paintStatic() in start/stop/resize paths.

---

# SPARC v5 phase reports — operator notes round

Date: 2026-11-15. Tickets MW-11/12/13 (In Progress). Spec: docs/sparc-v5-notes.md.

## N1+N2 — Headline copy + italic placeholders (MW-11)
- RED: 16 new contracts in tests/test_v5.py (13 failures + 1 error pre-change).
- GREEN: headline "We find / what's wrong / before your users do." — red accent + underline on "what's wrong", ink caret on baseline. All six placeholders italic; typed input upright.
- Defect fixed: line 3 wrapped at 390 in Special Elite (wider than Anton) → headline clamp tuned to 7.7vw; all three lines single-line at 390 (35px line boxes measured).
- v4 headline contract updated to the new approved copy (operator supersession).

## N3 — Services index (MW-12)
- 8 entries: 05 Accessibility scan (WCAG 2.1/2.2, selectable granularity, levels A/AA/AAA), 06 Penetration testing (authorized scope, findings + results as case file), 07 Reports, 08 CTA.
- Vision PASS at 390: sequential numbering, no overflow.

## N4+N5 — Eyebrow + font stack (MW-13)
- OPEN A CASE / FORM 01 eyebrow now above the form at all breakpoints (20px gap measured at 390).
- Rye + Anton removed entirely: @font-face blocks, tokens, 4 asset files. Stack = Special Elite + Source Sans 3 (regular/italic) + system fallbacks — 2 web families, 3 counting system stack.
- All display consumers retuned to typewriter metrics (headline, wordmark, sheet-title, step-num, pullquote, folio, topbar-mark, case-opened-title).
- Defects fixed: caret floated above baseline → vertical-align: baseline; confirmation card showed default blue focus ring → themed green outline.

## Verification
- 30/30 contract tests OK; node --check clean.
- Vision PASS at 390×844 and 1440×900 (hero + services).
- Reduced-motion: 0 animations, headline visible, sigil field hidden per CSS.
- no-JS: headline + 8 form fields visible without scripts.
- Form flow: empty submit focuses first invalid; filled submit files the case ("Case file opened." + FILED stamp).
- impeccable detect: 0 anti-patterns (1 advisory: intentional ruled-paper texture).

---

# SPARC v6 phase reports — content round (MW-7)

Date: 2026-11-15. Ticket MW-7 (In Progress), revival ticket MW-14 (Backlog). Spec: docs/sparc-v6-content.md.

## C1 — Contact channel: form only
- RED: 13 v6 contract failures pre-change (tests/test_v6.py).
- GREEN: `[contact email pending]` row replaced by Contact row linking `#intake` with explanation ("one channel, so nothing is lost and everything stays confidential"). Zero mailto/email anywhere. Form-failure copy no longer references a nonexistent address ("Try again in a moment.").
- Contact link styled to palette: red-deep underline, red on hover.

## C2 — Hours 24/7 + 24-hour reply
- Hours row: `24/7 · a person replies within 24 hours`.
- All six "business day" promises converted to "24 hours": lede note, desk-log step 1, form reassurance, case-opened confirmation, services entry 08, FAQ "How fast can you start?". Status strip "NIGHT DESK ON DUTY" kept.

## C3 — Featured finding removed
- `.finding` block (Sample finding, severity tag, Expected/Observed placeholders) deleted from File exchange. Files table + honest pending row kept.
- CSS: base `.finding`/`.sev-tag`/`.expected-observed` rules + desktop overrides removed; reveal selector in intake.js cleaned.

## C4 — Client quote removed
- `.pullquote` figure + `quote-sigil` SVG deleted. CSS: base rules, `sigil-turn` keyframes, desktop grid overrides, reduced-motion entry removed. v5 retune test updated (element no longer exists).
- Revival of C3 + C4 tracked in MW-14, gated on real customer reports/quotes — no fabricated content ships.

## Verification
- 44/44 contract tests OK (v4 + v5 + v6); node --check clean on both JS files.
- 390×844: contact rows correct, no finding/pullquote/blockquote, 0 mailto, no "business day" text, no horizontal overflow; form flow files case with 24-hour confirmation.
- 1440×900: notes two-column grid, sticky desk block, contact link red-deep underlined; vision PASS on Case notes (FAQ left, desk right, no dark quote card).
- Anchor mechanics: `#intake` target lands at 72px (scroll-padding) via scrollIntoView; smooth-scroll click probe is a harness artifact, direct geometry verified.
- Reduced-motion: sigil field + lamp hidden, reveals visible, no finding/quote.
- no-JS: contact rows + form action intact without scripts.

---

# SPARC v7 phase reports — brand round (MW-15)

Date: 2026-11-15. Ticket MW-15 (In Progress, epic MW-1). Spec: docs/sparc-v7-brand.md.

## B1 — Intake form heading larger + bold
- RED: 7 v7 contract failures pre-change (tests/test_v7.py).
- GREEN: `.eyebrow-live` (OPEN A CASE) now clamp(1.375rem, 4vw, 1.875rem), font-weight 700 — 22px at 390, 30px at 1440 (was 13px). `.sheet-eyebrow` row clamp(1rem, 2.6vw, 1.25rem); FORM 01 stays 0.8125rem faint typewriter counterweight; dotted leader + green live dot kept. Eyebrow remains inside `.intake-formwrap` above the form (v5 ruling intact).

## B2 — MysteryD wordmark as case-file stamp, larger than the CTA
- `.wordmark` restyled: double 3px frame in currentColor, rotate(-2deg), red-deep stamp ink, letterspacing 0.08em, hover to full red. Still a link to `#intake` with aria-label.
- Size: base clamp(2.25rem, 10vw, 4.5rem); desktop override 4.5rem. Measured wordmark vs headline: 320 → 36px vs 24.6px; 390 → 39px vs 30px; 1440 → 72px vs 44px. Dominates at every breakpoint.
- No new assets/fonts/motion; reduced-motion unaffected (static stamp).

## Verification
- 53/53 contract tests OK (v4 + v5 + v6 + v7); node --check clean on both JS files.
- 320/390/1440: wordmark > headline font-size, scrollWidth == viewport (no overflow), eyebrow 22–30px bold green, FORM 01 13px.
- Vision PASS: desktop masthead (stamp ≈1.7× headline, no clipping/overlap), desktop form heading (leader row clean, fields normal), mobile top (stamp dominant, hamburger 47px target, gutters intact).
- Reduced-motion: sigil field + lamp hidden, stamp + eyebrow sizes intact.
- Form flow at 390: filled submit files case — form hidden, case-opened visible ("The night desk will respond within 24 hours."), fail hidden.
- Harness flakes this round: 2 daemon timeouts on reload+evaluate chains — recovered via ensure_real_tab + new_tab, split into smaller steps. Mobile screenshot must scrollTo(0,0) after reload (scroll restore lands mid-page).
- Deploy note: v6 commit b4f0921 was local-only (handoff "pushed" claim stale); v7 push carries v6+v7 to both remotes together.

# SPARC v8 phase reports — operator notes (MW-16)

## Specification
- docs/sparc-v8-notes.md. Three operator notes: logo exactly 25% larger than headline; File exchange out of view but kept for later; "Case notes" → "FAQ".
- Interpretation: "25% larger" = exact ratio 1.25 at every viewport (v7 was ~1.3–1.6x, too big). Each headline clamp bound ×1.25 for the wordmark; desktop overrides likewise.
- Exchange hidden via `hidden` attribute (markup + CSS kept); Evidence nav links removed; FAQ folio 05→04; revival ticket MW-17 filed → Backlog.

## B1/B2/B3 — RED → GREEN
- RED: 7 v8 contract failures pre-change (ratio base/desktop, stamp kept, exchange hidden/markup/links/folios, FAQ title/copy/anchor — 10 tests, 7 failing).
- GREEN: wordmark base clamp(1.875rem, 9.625vw, 4.375rem); ≥1024 clamp(2.5rem, 4vw, 3.28125rem); ≥1440 3.4375rem. exchange section hidden; both Evidence links removed (topbar + site-nav — second link needed its own patch, 6-space indent); FAQ h2 + comments renamed; folio renumber. v7 dominance tests retuned to exact 1.25 ratio; desktop test rewritten per-media (old regex only parsed rem, not clamp).
- Suite: 63/63 OK (v4 14 + v5 16 + v6 14 + v7 9 + v8 10). node --check both JS files clean.

## Verification (browser, session mdweb-v8)
- Ratio measured in live DOM: 320 → 30.8/24.64px, 390 → 37.54/30.03px, 1440 → 55/44px — all exactly 1.25. No horizontal overflow at any width.
- Exchange: hidden=true, display:none, rect height 0, zero #exchange links. FAQ title "FAQ", folio 04.
- Vision pass: desktop 1440 + mobile 390 screenshots — stamp ~25% larger, no clipping/overlap (mobile stamp ends x≈263 of 390, clear of hamburger).
- Form flow at 390: filled submit files case — form hidden, case-opened visible, FILED stamp, ref timestamp, fail hidden.
- Reduced-motion: sigil field + lamp hidden, reveals visible (JS skips adding .reveal under RM — null-safe probe required). FAQ anchor lands top=72px; details toggle works.
- Harness notes: capture_screenshot() overwrites one path — copy between shots. RM removes canvas from DOM entirely (getComputedStyle on null throws); probe must null-guard.
