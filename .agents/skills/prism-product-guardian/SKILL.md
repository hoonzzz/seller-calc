---
name: prism-product-guardian
description: Protects Prism MVP scope and product integrity. Use before adding, redesigning, or prioritizing a feature, especially AI, automation, monetization, identity, ranking, real-time behavior, or growth mechanics.
---

# Prism Product Guardian

## Goal

Prevent attractive but premature features from weakening the core experience: question, vote, comments from both sides, attributed stance change, and persuasion marker.

## Required context

Read:

- `docs/01_PRODUCT_BRIEF.md`
- `docs/02_MVP_SCOPE.md`
- `docs/03_UX_CONTENT_SPEC.md`
- `docs/09_BUSINESS_MODEL_AND_GROWTH.md`
- `docs/12_DECISION_LOG.md`

## Evaluation

For the proposed feature answer:

1. What user problem does it solve?
2. Which exact core-loop step improves?
3. What measurable behavior should change?
4. Can it be tested without product code?
5. What new abuse, trust, privacy, moderation, or operating risk appears?
6. What existing MVP work would be delayed?

Classify it as:

- `MVP_CORE`: required for the approved first loop.
- `POST_MVP`: useful only after retention or usage evidence.
- `BUSINESS_STAGE`: monetization or B2B capability after audience scale.
- `REJECT`: conflicts with trust, fairness, or product identity.

## Hard rejections for MVP

Reject fake social proof, weighted votes, forced ad locks, auto-published AI topics, public demographic inference, identity-conflict bait, WebSocket or SSE without a proven live use case, and features that make changing one's mind feel like losing.

## Output

Return:

```markdown
## Decision

## User problem

## Core-loop impact

## Evidence needed

## Cost and risk

## Smallest test

## Recommendation
```
