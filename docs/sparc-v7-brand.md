# SPARC v7 — brand round (MW-15, 2026-11-15)

Spec source: operator notes, verbatim intent below. Ticket MW-15 under epic MW-1.

Operator notes (2026-11-15):
1. "In the intake form, make the heading larger and bold"
2. "I want the MysteryD logo to be in this case setting, and larger than the cta 'We find what's wrong before your users do.'"

## B1 — Intake form heading larger + bold
- The form heading is the `OPEN A CASE` eyebrow (`.eyebrow-live`) above the form (v5 ruling: eyebrow over form, kept).
- Enlarge: `.sheet-eyebrow` row grows; `.eyebrow-live` becomes clamp(1.375rem, 4vw, 1.875rem), font-weight 700 (bold).
- `FORM 01` stays the small faint typewriter counterweight; dotted leader and green live dot kept.
- No layout change: eyebrow stays inside `.intake-formwrap` before the form.

## B2 — MysteryD wordmark as case-file stamp, larger than the CTA headline
- `.wordmark` restyled as a rubber case-file stamp: double ink frame (border + offset outline), slight rotation (-2deg), red-deep stamp ink, typewriter face, letterspaced.
- Size dominates the headline at every breakpoint:
  - base: clamp(2.25rem, 10vw, 4.5rem) — 39px at 390 vs headline 30px; 32px at 320 vs headline 24.6px.
  - desktop (≥1024): 4.5rem (72px) vs headline 2.625–2.75rem (42–44px).
- Still a link to `#intake` with aria-label "MysteryD home". Hover shifts to full red.
- No new assets, no new fonts, no motion added (stamp is static; reduced-motion unaffected).

## Acceptance
- RED: tests/test_v7.py fails pre-change.
- GREEN: all v4+v5+v6+v7 contracts pass; node --check clean.
- Browser: wordmark font-size > headline font-size at 320, 390, 1440; no horizontal overflow; eyebrow visibly larger + bold; form flow still files a case.
- Deploy both Pages remotes; mirror Jira MW-15 + STATUS + handoff. Form A: MW-15 stays In Progress until operator close-out.
