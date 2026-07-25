# Bootstrap Prism MVP

Create the smallest runnable local foundation before implementing product behavior.

## Steps

1. Read `README.md`, `START_PROMPT.md`, `implementation_plan.md`, `docs/02_MVP_SCOPE.md`, `docs/04_TECH_ARCHITECTURE.md`, and all workspace rules.
2. Inspect the repository. Do not replace existing working files blindly.
3. Present a file-level plan for the foundation only.
4. Create or verify Composer PSR-4, `.env.example`, Docker Compose, Nginx, PHP-FPM, MariaDB, PHPUnit, and Playwright configuration.
5. Create the minimal bootstrap, router, request, response, error handler, database connection, and `/health` endpoint.
6. Create the migration runner but do not invent an ORM.
7. Run syntax checks, unit-test bootstrap, container health checks, and a local HTTP smoke test.
8. Update `implementation_plan.md` with completed work and the next vertical slice.
9. Report changed files, commands, test results, unresolved risks, and manual setup steps.

Stop before implementing voting or comments unless they are explicitly part of the approved task.
