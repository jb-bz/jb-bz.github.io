# SPARC v5 — operator notes round (2026-11-15)

Spec source: operator notes 1–5, verbatim intent below. Tickets MW-11, MW-12, MW-13 under epic MW-1.

## N1 · Headline copy (MW-11)
Exact copy: "We find what's wrong before your users do." (straight apostrophe, trailing period).
Replaces "Something is wrong. We find it before your users do." Red accent + drawn underline stay on "what's wrong"; ink stop square ends the line. Three display lines, entrance animation preserved.

## N2 · Italic placeholders (MW-11)
All six instruction placeholders render in italics (Source Sans 3 italic variable face already shipped). Placeholder strings unchanged. Typed input stays upright.

## N3 · Services index additions (MW-12)
Two new entries before the CTA:
- 05 Accessibility scan — thorough WCAG 2.1/2.2 audit; granularity selectable; conformance levels A, AA, AAA.
- 06 Penetration testing — authorized pen tests; findings, reproduction steps, results delivered as a case file.
"Reports and evidence" moves to 07; "Open a case" CTA becomes 08. Sheet lede count updates to eight entries.

## N4 · Eyebrow placement (MW-13)
"OPEN A CASE · FORM 01" eyebrow moves out of the lede column to directly above the intake form, visible at every breakpoint (it was lede-only before).

## N5 · Font stack collapse (MW-13)
Everything using Rye switches to Special Elite. Rye AND Anton removed entirely (faces, tokens, asset files). Stack = three families: Special Elite (display/typewriter), Source Sans 3 regular + italic (body/UI), system fallbacks only. Wordmark, sheet titles, headline, folios, step numbers, case-opened title, pullquote retuned for the new faces; sizes reduced where typewriter metrics are wider than the old display faces.

## Verification
Static contracts in tests/test_v5.py (RED before edits), full v4+v5 battery, node --check, impeccable detect, browser at 390×844 and 1440×900 (incl. reduced-motion and no-JS), live deploy to both Pages remotes, Jira close-out after operator confirmation.
