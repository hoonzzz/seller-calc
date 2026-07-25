# Prism Agent Entry Point

Read `START_PROMPT.md` before the first implementation task.

## Product

Prism is a working title for a mobile-first opinion product. The core loop is:

question discovery -> A/B vote -> results -> both comment sides -> a specific opposing comment changes the visitor's stance -> a real persuasion marker appears.

## Mandatory sources

1. `docs/02_MVP_SCOPE.md`
2. `docs/03_UX_CONTENT_SPEC.md`
3. `docs/04_TECH_ARCHITECTURE.md`
4. `docs/05_DATABASE_AND_EVENTS.md`
5. `docs/07_SECURITY_MODERATION_PRIVACY.md`
6. `docs/15_ACCEPTANCE_CRITERIA.md`
7. `.agents/rules/`

## Working rules

- Plan before implementation.
- Build one vertical slice at a time.
- Do not invent product scope.
- Do not fabricate social proof.
- Protect vote and persuasion integrity with transactions and unique constraints.
- Use server-rendered PHP and vanilla JavaScript.
- Test replay, race, XSS, CSRF, and mobile behavior.
- Never use production secrets, production DB write access, or autonomous deployment.

## Definition of done

A task is not complete until code, tests, browser verification, and affected docs agree.
