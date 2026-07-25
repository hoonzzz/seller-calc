# Security, Moderation, and Privacy Rules

Configure this workspace rule as **Always On** or **Model Decision** with the description: "Use for cookies, authentication, UGC, database writes, admin tools, analytics, deployment, and external services."

## Anonymous identity

- Generate a cryptographically secure random first-party cookie token.
- Store only an HMAC-SHA256 digest of that token in the database.
- Use Secure, HttpOnly, and SameSite=Lax in production.
- Do not use a raw IP address as the visitor identity.
- If an IP-derived rate-limit key is needed, use a rotating HMAC and short retention.

## UGC

- Store comments as plain text.
- Escape at output.
- Enforce length limits and rate limits server-side.
- Use status changes instead of hard deletion by default.
- A report threshold may collapse a comment but must not permanently delete it without review.
- Keep an administrator audit trail for moderation and topic changes.

## Web security

- Use CSRF tokens for every state-changing browser request.
- Use prepared statements for every value.
- Set secure session cookie options for administrators.
- Rate-limit admin login and write endpoints.
- Add security headers at Nginx or application level.
- Do not enable permissive CORS. Same-origin is the default.
- Do not commit `.env`, private keys, database dumps, analytics secrets, or MCP tokens.

## Agent safety

- Never connect an MCP server to a production database with write access.
- Never run destructive commands or production migrations without explicit review.
- Never print secrets into artifacts, logs, screenshots, or chat.
