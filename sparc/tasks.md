# SPARC v4 tasks — intake conversion pass

Release shape: single v4 release (12 pts total, under the ~30–40 pt guideline). Jira mirror under MW-1.

| # | Deliverable | Files | Tests (RED→GREEN) | Spike | Acceptance | Points | Jira |
|---|---|---|---|---|---|---|---|
| T1 | CTA headline replaces rejected copy | index.html, atmosphere.js (accent hook) | test_v4: headline assertions | — | No old copy; 3-line CTA; accent animation intact | 2 | MW-8 |
| T2 | Instruction placeholders + deadline/budget options + simplified errors | index.html, intake.js | test_v4: placeholder/select/error assertions | — | Zero sample data; 4 deadline options; 1 budget option | 3 | MW-9 |
| T3 | 16-glyph mythos sigil library, randomized glyph + motion | atmosphere.js | test_v4: glyph library assertions; runtime canvas hash diff | Original art from public-domain descriptions | ≥12 distinct glyphs; randomized spin/drift; reduced-motion static | 5 | MW-10 |
| T4 | Verify + deploy + Jira handoff | both Pages remotes | detect clean; live 200s; screenshots 390/1440 | — | Root live with v4; tickets awaiting user verification | 2 | MW-1 comment |

Story-point note: T3 carries the original-artwork spike. Operator ruling (2026-11-15): Symbolikon is permanently banned — no purchase, no swap-in, ever. All glyphs are original MysteryD drawings.
