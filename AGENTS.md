# Repository guidance

## Structure and naming

- `src/pages/`: route components, named `*Page.tsx`.
- `src/components/`: reusable UI components, named in PascalCase.
- `src/hooks/`, `src/context/`, `src/utils/`: hooks, shared React state, and pure helpers respectively.
- `src/data/` and `src/i18n/`: card/article content and translations.
- `public/`: static assets copied into the build.
- `scripts/`: repeatable maintenance and verification scripts; use descriptive kebab-case filenames.
- `docs/superpowers/specs/` and `docs/superpowers/plans/`: dated designs and implementation plans.
- `dist/`, `node_modules/`, and `*.tsbuildinfo` are generated and ignored. Do not commit them. Ask before deleting files, including generated files.
- Define placement, naming, and cleanup rules here before adding a new directory.

## Engineering and verification

- Communicate in Chinese; use English for code, commands, and identifiers.
- Find the root cause; do not disable checks or suppress failures to make a build pass.
- Preserve unrelated local changes and stage only the files belonging to the requested change.
- Run `npm run build` and `npm run verify:spa` for application changes.
- Run `npm run verify:ads` for advertising or result-page changes. It exercises the actual component effects with a deterministic host and no external ad requests.
- Verify draw, reveal, repeat draw, locale switching, and mode switching in a browser for result-page changes.
- Third-party advertising failures must not prevent displaying a reading. Initialize each ad container only after it mounts; stop bounded polling on completion or unmount.
- Never put secrets, tokens, or passwords in source, commits, or logs.

## Approval boundaries

Obtain explicit user authorization before deleting files/directories/Git history; modifying `.env`, credentials, tokens, or CI/CD configuration; changing database schemas or migrating data; pushing, rebasing, hard-resetting, or force-pushing Git; installing global dependencies or changing system settings; or publishing/deploying publicly.

For large changes, present a plan and obtain approval before implementation. Existing authorization in the current conversation applies to the specific actions approved by the user.
