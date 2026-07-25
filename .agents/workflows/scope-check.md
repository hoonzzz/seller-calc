# Scope Check

Evaluate a proposed feature before design or implementation.

## Steps

1. Run the `prism-product-guardian` skill.
2. Classify the feature as MVP core, post-MVP candidate, business-stage feature, or reject.
3. State the specific user problem and which core-loop step it improves.
4. Estimate implementation surface: schema, backend, UI, moderation, privacy, analytics, operations, and tests.
5. Identify the smallest reversible experiment.
6. Compare opportunity cost against the next unfinished MVP slice.
7. Recommend build now, test manually, defer, or reject.
8. When the decision changes scope, append it to `docs/12_DECISION_LOG.md`.
