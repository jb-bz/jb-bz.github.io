# SPARC v4 phase reports — intake conversion pass

Date: 2026-11-15. Board: MW (mysteryd.atlassian.net, board 46). Epic MW-1.

## T1 — CTA headline (MW-8, 2 pts)
- RED: static contract test asserted rejected copy absent, new CTA present. Failed pre-change.
- GREEN: headline now "Something is wrong. / We find it / before your users do." Red accent + underline on "wrong."
- Underline collision defect found at 390px (inline box 68px vs 51px line box). Fixed: `.hl-wrong { display:inline-block; line-height:1 }`, headline line-height 1.06→1.14, underline offset 0.18em→0.06em. Geometry re-measured: 3.3px gap box-to-next-line; vision check PASS (clear air, no contact).
- Alternates B/C/D presented in chat; operator pick pending.

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
