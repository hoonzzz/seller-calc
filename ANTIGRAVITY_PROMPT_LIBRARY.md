# Antigravity Prompt Library

Use `START_PROMPT.md` once at the beginning of the Project. After the agent has read the repository and its implementation plan is approved, use the prompts below one slice at a time.

## 1. Bootstrap foundation

```text
/bootstrap-mvp

Build only the local project foundation described in Work Group 0 of implementation_plan.md.
Do not implement topics, voting, comments, or administration yet.
Finish with a runnable /health endpoint, test bootstrap, documented commands, and a browser smoke check.
```

## 2. Home and topic read flow

```text
/implement-slice

Implement the read-only topic discovery slice:
- published topics on the mobile home
- topic detail by slug
- honest empty and low-activity states
- draft and archived topics hidden from public routes

Use the seed topics in database/seed.sql.
Do not implement voting in this slice.
```

## 3. Anonymous identity and first vote

```text
/implement-slice

Implement anonymous visitor identity and first voting:
- secure first-party visitor cookie
- HMAC digest in the database
- one current vote per visitor and topic
- results hidden before voting
- atomic initial vote event and topic counters
- safe replay behavior

Add unit, integration, and mobile E2E coverage.
```

## 4. Comment reading and writing

```text
/implement-slice

Implement the comment slice:
- A and B comment tabs
- voting required before writing
- comment side derived from the server-side current vote
- 10 to 1000 character plain text
- output escaping
- recommendation with one-per-visitor constraint

Keep comments as the visual focus. Do not add replies, profiles, markdown, links, or ranking tiers.
```

## 5. Attributed stance change

```text
/implement-slice

Implement Prism's defining slice:
- change-of-mind action only on an opposing comment
- one stance change per visitor and topic
- target side derived from the selected comment
- one atomic transaction for current vote, event, topic counters, and comment persuasion counter
- real persuasion marker hidden at zero
- honest, calm completion copy

Run the data-integrity and security reviewer skills. Replay the endpoint and test concurrent requests.
```

## 6. Moderation and minimal administration

```text
/implement-slice

Implement the smallest safe operations slice:
- comment report with unique visitor constraint
- threshold-based COLLAPSED state rather than permanent deletion
- administrator login with secure session and throttling
- topic create, edit, publish, close, and archive
- comment hide and restore
- administrator audit log

Do not add staff roles, rich dashboards, bulk automation, or production database MCP access.
```

## 7. Share and analytics hooks

```text
/implement-slice

Implement Open Graph metadata, native share with copy-link fallback, and GA4 event hooks from docs/08_ANALYTICS_AND_EXPERIMENTS.md.
Do not send comment text, visitor hash, IP, or sensitive content to analytics.
The product must remain fully usable when analytics is blocked.
```

## 8. Mobile UX review

```text
/browser

Review the local Prism build as a new visitor at 390x844.
Complete the entire core loop from home to vote to both comment sides to one attributed stance change.
Then repeat at 1440x900 and with keyboard-only navigation.
Use the prism-mobile-ux-reviewer skill.
Return blockers first and attach screenshots or a walkthrough artifact.
```

## 9. Release gate

```text
/verify-release

Audit the release candidate against every item in docs/15_ACCEPTANCE_CRITERIA.md.
Do not fix unrelated polish while auditing.
Separate release blockers from follow-up improvements.
A release is not ready if duplicate votes, duplicate persuasion, XSS, CSRF bypass, admin bypass, mobile flow failure, counter mismatch, or missing backup restore evidence remains.
```

## 10. Feature idea triage

```text
/scope-check

Evaluate this proposal without implementing it:
[PASTE FEATURE IDEA]

Compare it against the unfinished MVP work and recommend build now, manual experiment, defer, or reject.
```
