# Database Starter

## Files

- `schema.sql`: local bootstrap schema.
- `seed.sql`: five published launch topics and five draft reserves.
- `integrity_audit.sql`: read-only counter and attribution reconciliation.

## Important

The Docker entrypoint runs `schema.sql` and `seed.sql` only when the database volume is first created. After development begins, create numbered migration files and a migration runner. Do not use volume deletion as the normal migration method.

All vote, recommendation, report, and stance-change uniqueness must be protected by both server logic and database constraints.
