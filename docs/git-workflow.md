# Git Workflow

## Branching

- Features: `feat/your-feature-name`
- Bugfixes: `fix/your-bugfix-name`
- Merge via PRs to `master`

## Commit/PR Format

- Title: `feat: <message>` or `fix: <message>`
- Imperative mood (Add, Enable, Remove)
- Capital first letter, no ending period
- Don't repeat type in description, not even as a verb (`fix: Fix …` is wrong)
    - Good: `fix: Stop fnm script on first error; Restore starting Node version on exit`
    - Bad: `fix: Fix start race; Fix truncation`

## Changelog
- Every user- or dev-facing change adds a line under the unreleased version in `CHANGELOG.md`, in the same PR
