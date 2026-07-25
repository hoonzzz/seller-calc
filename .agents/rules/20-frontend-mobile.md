# Mobile Frontend Rules

Configure this workspace rule as **Glob** for `public/**/*.{css,js}` and `views/**/*.php`.

## Experience

- Design for a 390 px viewport first, then expand to desktop.
- Preserve a calm, curious tone. Avoid a hostile red-versus-blue battle aesthetic.
- Use explicit A and B labels in addition to color.
- Give every primary action a touch target of at least 44 by 44 CSS pixels.
- Voting must take one clear tap. Results stay hidden until a successful vote.
- Put A comments and B comments behind obvious tabs or segmented controls.
- Show the change-of-mind action only on a comment from the opposite side.
- Persuasion count is hidden when zero.
- Under ten real participants, follow the progressive disclosure policy in `docs/03_UX_CONTENT_SPEC.md`.
- Empty states must be honest and useful. Never synthesize activity.

## Rendering

- Use server-rendered HTML as the baseline.
- Use vanilla JavaScript only for progressive enhancement and local updates.
- Do not introduce React, Vue, a SPA router, a frontend state library, or a bundler in the MVP.
- Keep core content and navigation available without JavaScript.
- Escape all user-generated content. Never inject comment text through `innerHTML`.
- Prefer semantic HTML, native controls, and CSS custom properties.

## Accessibility

- Provide keyboard operation, visible focus, descriptive labels, and useful error messages.
- Do not rely on color alone.
- Respect `prefers-reduced-motion`.
- Keep motion brief and non-blocking.
- Maintain readable line length and line height for long comments.

## Browser verification

For every user-facing slice, verify at 390 by 844 and 1440 by 900. Capture the complete new-visitor flow rather than isolated screenshots only.
