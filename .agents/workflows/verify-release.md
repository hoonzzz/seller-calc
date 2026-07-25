# Verify a Prism Release Candidate

Audit the current build against product, integrity, security, accessibility, and deployment gates.

## Steps

1. Read `docs/15_ACCEPTANCE_CRITERIA.md` and convert every checkbox into pass, fail, blocked, or not applicable.
2. Run Composer validation, PHP syntax checks, static analysis, PHPUnit, and Playwright E2E.
3. Verify a new visitor can discover a topic, vote, see results, open both sides, submit a comment, recommend, report, change stance through an opposing comment, see a real persuasion marker, share, and move to another topic.
4. Replay vote, recommendation, report, and stance-change requests. Confirm counters do not duplicate.
5. Run the data-integrity audit queries and compare event rows with cached counters.
6. Review XSS, CSRF, SQL injection, cookie flags, admin authentication, rate limits, secret handling, and error output.
7. Verify 390 by 844 and 1440 by 900. Include keyboard use, focus states, reduced motion, empty states, and long comments.
8. Verify unpublished topics and hidden comments cannot leak through direct URLs or APIs.
9. Verify migration, backup, restore, HTTPS, health check, and rollback documentation.
10. Produce a release report with blockers first. Do not mark the release ready while any blocker remains.
