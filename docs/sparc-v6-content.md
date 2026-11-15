# SPARC v6 — content round (MW-7, 2026-11-15)

Spec source: operator notes, verbatim intent below. Ticket MW-7 under epic MW-1. Revival ticket MW-14 (Backlog).

## C1 · Contact channel (email removed)
Users can only contact through the intake form. The `[contact email pending]` row is replaced with a Contact row that explains the form-only policy and links to `#intake`. No mailto or email address ships anywhere. The form-failure message no longer points at "the address in the case notes" (there is no address); it says to try again.

## C2 · Hours + response promise
Hours row: `24/7 · a person replies within 24 hours`. Every "business day" promise on the page becomes "24 hours" (lede note, desk log step 1, form reassurance, case-opened confirmation, services entry 08, FAQ "How fast can you start?"). Status strip "NIGHT DESK ON DUTY" stays.

## C3 · Featured finding removed
The `.finding` block (Sample finding, severity tag, Expected/Observed) is removed from File exchange. The files table and its honest pending row stay. Revival tracked in MW-14 once real customer reports exist.

## C4 · Client quote removed
The `.pullquote` figure ("What we find stays found." + rotating quote-sigil) is removed from Case notes. Revival tracked in MW-14 once a real, permissioned client quote exists.

## Removal policy (v5 precedent)
Dead CSS is deleted, not parked: `.finding*`, `.sev-tag`, `.expected-observed`, `.pullquote`, `.quote-sigil`, `@keyframes sigil-turn`, their reduced-motion and desktop rules. `intake.js` reveal selector drops `.finding` and `.pullquote`. MW-14 restores from git history at the removal commit. The v5 contract test N5 `test_former_anton_elements_retuned` drops the `.pullquote blockquote` selector (element no longer exists); all other v4/v5 contracts stay green.

## Exact copy
- Contact row: "Every case starts at the intake form — one channel, so nothing is lost and everything stays confidential." (link on "intake form" → #intake)
- Hours row: "24/7 · a person replies within 24 hours"
- Form failure: "The desk could not file the case just now. Try again in a moment."
- Lede note: "Every case is read by a person. The night desk replies within 24 hours."
- Desk log 1: "Intake read. A person reads the form within 24 hours."
- Reassurance: "A human replies within 24 hours. Nothing is fabricated."
- Case opened: "The night desk will respond within 24 hours."
- Services 08: "Start with the intake form. A person reads it and replies within 24 hours."
- FAQ start: "Intake is read within 24 hours. A scoped engagement usually starts within a week; release-verification passes can be slotted faster when the date is fixed."

## Verification
Static contracts in tests/test_v6.py (RED before edits), full v4+v5+v6 battery, node --check, browser at 390×844 and 1440×900 (incl. reduced-motion and no-JS), live deploy to both Pages remotes, Jira mirror. Form A: MW-7 stays In Progress until operator confirms live.