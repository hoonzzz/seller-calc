# PHP Backend Rules

Configure this workspace rule as **Glob** for `**/*.php`.

## Runtime and style

- Target PHP 8.4 while preferring syntax compatible with PHP 8.3 or later.
- Start every PHP source file with `declare(strict_types=1);`.
- Use Composer PSR-4 autoloading under the `Prism\\` namespace.
- Keep controllers thin. Put state transitions and invariants in domain services.
- Prefer small explicit classes over a framework, service container, magic ORM, or global helper collection.
- Use typed parameters, return types, readonly value objects where useful, and domain-specific exceptions.
- Do not expose stack traces, SQL, secrets, or internal paths to the browser.

## Database access

- Use PDO with native prepared statements.
- Never interpolate user input into SQL, identifiers, `ORDER BY`, `LIMIT`, or fragments.
- Whitelist dynamic sort keys and directions in PHP.
- Keep transaction boundaries inside the domain service that owns the state transition.
- For vote and stance-change transitions, lock the current vote row and update all counters in one transaction.
- Treat duplicate-key exceptions as idempotency signals only when the relevant unique constraint is known.
- Never use `SELECT *` in production queries.

## HTTP and validation

- Validate and normalize all input on the server even when JavaScript validates it first.
- Return consistent JSON error envelopes for fetch endpoints.
- Use appropriate status codes: 400 validation, 401 admin auth, 403 policy, 404 missing or unpublished, 409 state conflict, 422 semantic validation, 429 rate limit, 500 unexpected.
- Require CSRF protection for every state-changing browser request.
- Use Post/Redirect/Get for server-rendered form submissions.
- Keep core flows usable when analytics or external services fail.

## Tests

Every state-changing endpoint needs tests for success, invalid input, replay, authorization or visitor state, and counter consistency.
