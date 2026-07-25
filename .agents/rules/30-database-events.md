# Database and Event Integrity Rules

Configure this workspace rule as **Glob** for `database/**/*.sql` and `src/Domain/Voting/**/*.php`.

## Source of truth

- `topic_votes` stores current voter state.
- `vote_events` stores append-only initial-vote and stance-change facts.
- Denormalized counters exist for display performance, not as the only source of truth.
- A stance change must reference the exact opposing comment selected by the visitor.

## Required constraints

- One `topic_votes` row per topic and visitor.
- One initial-vote event per topic and visitor.
- At most one stance-change event per topic and visitor in the MVP.
- One recommendation per comment and visitor.
- One report per comment and visitor.
- Foreign keys must prevent cross-topic attribution through application validation and transaction checks.

## Atomic transitions

Initial vote and stance change must be transactionally atomic. A failed request must not leave partial counters or an event without current state.

For stance change:

1. Lock the current vote.
2. Confirm the visitor has not changed before.
3. Load and lock the attributed comment.
4. Confirm the comment belongs to the topic, is visible or collapsed, and is on the opposite side.
5. Update current side and changed timestamp.
6. Insert the stance-change event.
7. Decrement the old topic counter and increment the new one.
8. Increment topic changed-visitor count.
9. Increment comment persuasion count.
10. Commit.

## Migrations

- Never edit an applied production migration.
- Prefer additive and reversible changes.
- Back up before destructive changes.
- Document counter rebuild queries whenever a new counter is introduced.
- Do not use production credentials in an MCP server or automated agent.
