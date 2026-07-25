---
name: prism-vertical-slice-builder
description: Implements one Prism capability end to end from database and domain rules through server-rendered UI, tests, browser evidence, and documentation. Use for any approved product feature.
---

# Prism Vertical Slice Builder

## Before coding

1. Read the relevant product and technical docs.
2. Identify the user outcome and acceptance criteria.
3. Confirm the task is one slice rather than a horizontal platform rewrite.
4. List every file expected to change.
5. Identify transaction, idempotency, moderation, and privacy boundaries.

## Build order

1. Schema or migration.
2. Domain invariant and service.
3. Persistence query.
4. Route and controller.
5. Server-rendered view.
6. Vanilla JavaScript enhancement.
7. Unit and integration tests.
8. E2E flow.
9. Documentation and decision log.

## Required quality gates

- Server validation is authoritative.
- DB constraints protect uniqueness.
- State changes are atomic.
- Replayed requests are safe.
- UGC is escaped.
- Failure states are visible and recoverable.
- Mobile and keyboard flows work.
- No unrelated refactor is bundled.

## Completion report

Include changed files, schema impact, endpoint behavior, tests run, browser evidence, remaining risk, and next slice. Do not claim completion without executable evidence.
