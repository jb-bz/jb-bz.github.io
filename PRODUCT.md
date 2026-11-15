# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

One static HTML page plus one CSS file. Vanilla JavaScript for the intake form only. No framework, no build step, no bundler, no CSS preprocessor, no component library, no animation library, no external JS dependency. Fonts self-hosted, never hotlinked. Fluid clamp() scale in CSS custom properties, min-width breakpoints only. Mobile-first: 390x844 single column is the base; nothing scrolls horizontally from 320px up.

## Users

Primary: a product or engineering lead at a small to mid-size company with an imminent release, who suspects something is broken that nobody can reproduce and has no internal QA capacity. They arrive from a referral or a search, usually on a phone, and decide within one screen whether this is a real firm they can hand a product to. Their fear is being sold a report nobody can act on.

Secondary: a hiring manager or procurement reviewer skimming for credibility (sections 3 and 5), who never fills the form. The page must not look fabricated to them; invented figures are banned outright.

## Product Purpose

MysteryD is a software quality assurance studio in Los Angeles, established 2011. It tests client products and produces plain-English QA reports with numbered, reproducible findings. The web page exists to make one visitor action possible: opening an intake case for a new QA engagement. Everything else on the page makes that action feel trustworthy enough to take and answers the questions that stop someone from taking it.

## Positioning

QA work is detective work. MysteryD is framed as a private investigation firm that happens to be a QA studio: intake is opening a case, testing is fieldwork, findings are a case file. What is being hunted is the thing that is wrong with a client's product that nobody else will look at. Proof is methodology (nine named steps), a real sample finding with Expected versus Observed, and sanitized case rows — never invented metrics.

## Operating Context

The page is a formal engraved document (intaglio plate), not a printed poster and not a screen. The horror layer is Lovecraftian in undertow only, never named as such, and lives in furniture and word choice, never in sales copy. Every visitor-facing word must let a prospect with zero Lovecraft literacy tell what they are buying within three seconds. Intake promise: a human replies within one business day; nothing is fabricated.

## Capabilities and Constraints

- Five fixed sections in order: 01 OPEN A CASE (intake above the fold), 02 SERVICES INDEX, 03 THE NINE STEPS (Discover, Scope, Plan, Prepare, Execute, Report, Retest, Regression, Close), 04 FILE EXCHANGE (sanitized .REP table plus one real sample finding), 05 CASE NOTES (FAQ and pricing approach as announcements, contact lines, pull-quote strip, footer).
- Nav labels SERVICES, METHOD, EVIDENCE, FAQ, OPEN A CASE point only at in-page anchors. No links to other pages.
- Intake form fields, exact order and labels: YOUR NAME, WORK EMAIL, ORGANIZATION, PRODUCT UNDER INVESTIGATION, PLATFORMS, THE NATURE OF YOUR PROBLEM, DEADLINE, BUDGET RANGE. Underline-only fields, inline validation, one 52px primary button labelled OPEN CASE, helper line "A HUMAN REPLIES WITHIN ONE BUSINESS DAY. NOTHING IS FABRICATED.", success panel "CASE FILE OPENED. THE NIGHT DESK WILL RESPOND WITHIN ONE BUSINESS DAY."
- Form action is a placeholder handler returning success; the real destination is undecided. The form must submit as a real POST with JavaScript disabled.
- No invented pricing, client names, dates, team size, revenue, percentages, or metrics anywhere. The section 4 sample finding must come from the real source QA report; until supplied it is an explicit unresolved placeholder.
- American English only (ORGANIZATION with a Z). No exclamation marks in visitor-facing copy. No purple.
- Motion: native CSS only, scroll-driven via animation-timeline inside @supports and prefers-reduced-motion guards; reduced motion pins everything to resting state and reverts the ink ramp to static per-section grounds.
- Accessibility: semantic HTML, exactly one h1, intact heading order, labeled controls, visible focus in the functional rule token, keyboard operable in DOM order, artefacts and folios aria-hidden.

## Brand Commitments

Name: MysteryD. Established 2011, Los Angeles. Visual direction pinned whole by Brief v8.1 "INTAGLO PLATE": locked measured palette (quiet ground #F2EFE8 to dense ground #E0DBCE ink ramp; plate ink #171A1F; mid ink #3E444E; furniture #565E6C; oxblood accent #8E2A2A on the word WRONG and severity labels only; navy button fill #1E3A5F; functional rule #686F7E; decorative rule #8A92A0; folio watermark #DDD7C8). Four faces, one job each: Bodoni Moda (headline and pull-quote only, weight 700-900, high optical size, 34px mobile floor), Source Sans 3 (all body, 16px minimum), Bodoni Moda SC (furniture only, uppercase, ~0.14em tracking, never over 15px, low optical size), Bodoni Moda tabular lining figures for plate numerals. Exactly two filled rectangles: the navy button and the plate-ink pull-quote block reading "WHAT WE FIND STAYS FOUND." No boxes, no rounded corners, no shadows, no glow anywhere. Hero headline: "WE FIND THE THING THAT IS WRONG WITH YOUR PRODUCT". Hero subline: "Full-cycle QA and adversarial testing, run like a case file. Plain-English findings, numbered steps to reproduce, no fabrication."

## Evidence on Hand

- IDEA.md (one line: this is the project for MysteryD's web page).
- Brief v8.1 INTAGLO PLATE (user-supplied, the only source of truth).
- No source QA report supplied yet: the section 4 sample finding is an unresolved placeholder and must be requested, never invented.
- No real client quotes, case-file sizes, dates, contact email, or office hours supplied: these are explicit placeholders flagged in DESIGN.md, never fabricated.
- Self-hosted variable fonts downloaded to assets/fonts/ (Bodoni Moda, Bodoni Moda SC, Source Sans 3, latin subsets, OFL).

## Product Principles

1. One action: opening a case. Every section earns trust for that action or is cut.
2. Document authority over pulp energy: the detective theme is carried by plate, seal, folio and hairline, never by horror spectacle.
3. Nothing fabricated: no invented figure ships; missing evidence is an explicit placeholder.
4. Plain business English with an undertow: flavor comes from word choice and rhythm, never archaic diction.
5. The measured palette is law: every pairing passes at both ends of the ink ramp; decoration never sits under running text.

## Accessibility & Inclusion

WCAG-grade contrast enforced by the brief's locked measured table at both ramp endpoints (body and labels 4.5:1, large display 3:1, functional rules and focus indicators 3:1). Functional (#686F7E) and decorative (#8A92A0) rule tokens never swap roles. The highlighted word WRONG carries a second cue beyond hue (weight step plus engraved underline). Minimum tap target 44px; primary button 52px. Reduced motion fully honored. Screen-reader landmark structure with exactly one h1.