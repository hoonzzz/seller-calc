# Prism Product North Star

Configure this workspace rule as **Always On**.

## Product truth

Prism is a mobile-first opinion product where people discover an A/B question, vote, read both sides, and may change their position because of one specific comment.

The working title is Prism. Do not treat it as a cleared public brand.

## Internal sequence

Features create culture. Culture creates data. Data creates business.

Never reverse this sequence. The user comes for curiosity, comments, and a satisfying change-of-mind moment. The user does not come to generate research data.

## Scope filter

A feature belongs in the MVP only when it directly improves at least one of these outcomes:

1. More visitors cast a real vote.
2. More voters read comments from both sides.
3. More voters identify a specific comment that changed their position.
4. More visitors continue to another topic, share, or return.

When a feature does not pass this test, defer it and record the decision in `docs/12_DECISION_LOG.md`.

## Non-negotiable principles

- Never fabricate votes, comments, recommendation counts, participant counts, or persuasion counts.
- Show voting results only after the visitor votes.
- Never sell weighted voting power.
- Treat changing one's mind as flexible and intelligent, not as losing.
- A persuasion marker must come from a valid stance-change event attributed to that exact comment.
- Do not use hate, identity conflict, or harassment as an acquisition tactic.
- Do not auto-publish AI-generated topics in the MVP.
- Do not add AI summaries, ads, subscriptions, WebSocket, SSE, accounts, profiles, reply trees, or user-created topics in the MVP.
- Prefer a complete vertical slice over broad unfinished architecture.

## Source documents

When a decision is unclear, read these in order:

1. `docs/01_PRODUCT_BRIEF.md`
2. `docs/02_MVP_SCOPE.md`
3. `docs/03_UX_CONTENT_SPEC.md`
4. `docs/15_ACCEPTANCE_CRITERIA.md`
5. `docs/12_DECISION_LOG.md`

Do not silently override an existing product decision. Propose the change and explain its user value, cost, risk, and acceptance criteria.
