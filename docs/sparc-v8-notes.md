# SPARC v8 — operator notes (MW-16)

Date: 2026-11-15. Operator notes, verbatim intent:

1. The MysteryD logo should be 25% larger than the "We find what's wrong before your users do." copy.
2. File exchange section should be taken out of view, although maybe useful later.
3. "Case notes" should be renamed "FAQ".

## B1 — Logo exactly 1.25x the headline

- Interpretation: "25% larger than" = exact ratio 1.25, not merely larger (v7 was ~1.3-1.6x).
- Base: headline `clamp(1.5rem, 7.7vw, 3.5rem)` → wordmark `clamp(1.875rem, 9.625vw, 4.375rem)` (each bound ×1.25, so ratio holds at every width below 1024).
- Desktop ≥1024: headline `clamp(2rem, 3.2vw, 2.625rem)` → wordmark `clamp(2.5rem, 4vw, 3.28125rem)`.
- ≥1440: headline `2.75rem` → wordmark `3.4375rem` (55px vs 44px).
- Stamp styling from v7 kept: double frame, rotate(-2deg), red-deep ink, typewriter face.
- Tests: pointwise ratio == 1.25 (±0.01) at 320/390/600/768/1023 and desktop overrides at 1024/1440. v7 dominance tests retuned to exact ratio.

## B2 — File exchange out of view, kept for later

- `<section id="exchange">` gains `hidden` attribute: removed from render and accessibility tree, markup intact for revival.
- Both nav links to `#exchange` (topbar + site-nav, label "Evidence") removed — no dead links.
- Folio renumber: notes section 05 → 04 (visible sequence 01, 02, 03, 04). Hidden exchange keeps `data-folio="04"` + revival comment; on revival, renumber notes back to 05.
- CSS for exchange kept (revival-ready). intake.js scroll-spy reads links dynamically — no JS change needed.

## B3 — Case notes → FAQ

- `h2#notes-title` text "Case notes" → "FAQ". Section id `notes` kept (nav anchors unchanged; nav labels already "FAQ").
- Section comment renamed; CSS comment renamed. No other copy changes.

## Verify + deploy

- RED tests `tests/test_v8.py`, GREEN, full suite (v4+v5+v6+v7 retuned+v8).
- Browser 320/390/1440: ratio check, exchange invisible, FAQ heading, no overflow; form flow; reduced-motion.
- Commit + push both Pages remotes, live verify, Jira MW-16 comment, STATUS + handoff mirror. Form A: MW-16 stays In Progress until operator close-out.
