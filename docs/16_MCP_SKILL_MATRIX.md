# 16. MCP and Skill Matrix

## Principle

Use the smallest tool surface that removes a real information or execution gap. More MCP servers do not mean a better agent. They add permissions, context, failure modes, and tool-selection ambiguity.

## Recommended setup

| Need | First choice | Add only when | Access policy |
|---|---|---|---|
| Product scope | `prism-product-guardian` skill | Any feature or priority changes | Workspace only |
| End-to-end feature build | `prism-vertical-slice-builder` skill | An approved slice is ready | Workspace only |
| Mobile visual QA | Antigravity `/browser` | Every user-facing slice | Ask for browser access |
| Repeatable browser automation | Playwright Test in repository | Core flow becomes stable | Local test environment |
| Exploratory agent browser control | Playwright MCP | Built-in browser cannot express the loop | Disabled by default, isolated profile |
| Current library docs | Context7 MCP | API or configuration details may be stale | Read only |
| Repository, issues, PRs | GitHub MCP | A remote repository exists | Read-only first, writes require review |
| Database diagnosis | MariaDB MCP | Schema is stable and manual SQL becomes costly | Local or replica, read-only account |
| Security review | `prism-security-reviewer` skill | Every write path and release | No production secrets |
| Counter reconciliation | `prism-data-integrity-reviewer` skill | Any social proof or state counter changes | Local or read-only replica |
| Launch topic quality | `prism-topic-editor` skill | Seed or editorial topics are created | No live web data required |

## Do not install for the MVP

- A general filesystem MCP. Antigravity already has workspace file access.
- A production SSH MCP.
- A database MCP with write privileges.
- Multiple overlapping browser MCP servers.
- Stripe, email, notification, or ad-network MCP servers.
- Trend scraping and AI publishing tools.
- A vector database or RAG stack.

## Activation order

1. Start with workspace rules and skills only.
2. Use the built-in browser for visual QA.
3. Enable Context7 when an external API or version is uncertain.
4. Connect GitHub after the local foundation is committed.
5. Enable Playwright MCP only for exploratory agent loops. Keep Playwright Test as the release gate.
6. Add MariaDB read-only access only after the schema exists and integrity queries are useful.

## GitHub policy

Prefer the Antigravity MCP Store for OAuth installation. Start with the read-only remote endpoint. Allow issue or PR writes only after the repository workflow is stable. Commit, push, merge, branch deletion, and release publication always require explicit review.

## Database policy

A database MCP is diagnostic. It is not the migration engine. Schema changes remain versioned SQL files reviewed in Git. Production data access is outside the MVP agent workflow.
