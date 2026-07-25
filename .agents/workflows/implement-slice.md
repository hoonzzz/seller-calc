# Implement One Vertical Slice

Complete one approved user-visible capability from data model through browser verification.

## Steps

1. Restate the user outcome and list the relevant acceptance criteria from `docs/15_ACCEPTANCE_CRITERIA.md`.
2. Run the `prism-product-guardian` skill. Stop or narrow the task if it is outside MVP scope.
3. Inspect affected schema, domain services, routes, views, JavaScript, and tests.
4. Write a file-level plan with dependencies and transaction boundaries.
5. Implement in this order: migration, domain rule, persistence, HTTP endpoint, server-rendered UI, progressive enhancement, tests, docs.
6. Add server-side validation and idempotency before polishing animations.
7. Run PHP syntax, static analysis when configured, PHPUnit, and the smallest relevant Playwright test.
8. Run the `prism-data-integrity-reviewer` skill for vote, recommendation, report, or persuasion changes.
9. Run the `prism-security-reviewer` skill for any write endpoint, cookie, session, UGC, or admin change.
10. Use `/browser` for the full flow at mobile width. Capture evidence.
11. Update the decision log only when a product or architecture decision changed.
12. Report the completed slice, changed files, tests, browser evidence, remaining risks, and the next recommended slice.

Do not start the next slice in the same run without explicit approval.
