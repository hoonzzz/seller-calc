# 17. Windows and Antigravity Quick Start

## Prepare the folder

1. Extract the starter pack to a short local path such as `C:\dev\prism`.
2. Open PowerShell in that folder.
3. Initialize Git.
4. Copy `.env.example` to `.env`.
5. Replace `APP_KEY` with at least 32 random bytes. A local PHP command can generate a hexadecimal value:

```powershell
php scripts/generate_app_key.php
```

Do not commit `.env`.

## Create the Antigravity Project

1. Create a new Project and add only this folder.
2. Start in Local Mode.
3. Use Planning Mode.
4. Set terminal execution to Request Review.
5. Set artifact review to Request Review.
6. Set outside-folder access to Always Deny.
7. Enable Strict Mode for the initial bootstrap when available.

Strict Mode may block network package installation. Temporarily approve only the exact Composer or npm action after reviewing it rather than switching the whole Project to Always Proceed.

## Activate customizations

### Skills

Antigravity should discover folders under `.agents/skills/`. Confirm the six Prism skills appear in Customizations.

### Rules

Configure activation in the Rules panel:

- `00-product-north-star.md`: Always On
- `10-php-backend.md`: Glob `**/*.php`
- `20-frontend-mobile.md`: Glob `public/**/*.{css,js}` and `views/**/*.php`
- `30-database-events.md`: Glob `database/**/*.sql` and `src/Domain/Voting/**/*.php`
- `40-security-privacy.md`: Always On or Model Decision

### Workflows

Confirm these slash commands are available:

- `/bootstrap-mvp`
- `/implement-slice`
- `/verify-release`
- `/scope-check`

## MCP setup

The workspace file `.agents/mcp_config.json` and its example copy ship with every server disabled.

Recommended sequence:

1. Install GitHub from the Antigravity MCP Store after creating the repository.
2. Enable only the needed Context7 or Playwright entry in `.agents/mcp_config.json`.
3. Keep every new server disabled until its purpose and permissions are reviewed.
4. Do not connect MariaDB MCP to production. A local read-only user is the maximum recommended access.

## First conversation

Paste all of `START_PROMPT.md` into a new Planning Mode conversation. Review the generated implementation plan. Approve only Work Group 0 or the first vertical slice.

## Local runtime

After the bootstrap slice creates the application entry point:

```powershell
Copy-Item .env.example .env

docker compose up -d --build

docker compose ps
```

Open the local site at `http://localhost:8080` and the database only through `127.0.0.1:3307` when a local client is needed.

Never run `docker compose down -v` unless intentionally deleting the local database volume.
