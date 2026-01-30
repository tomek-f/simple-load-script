# AGENTS.md

## Setup commands
- Install deps: `npm install`
- Run tests: `npm run test-run`
- Build: `npm run build`
- Lint: `npm run lint`
- Lint fix: `npm run lint-fix`
- Format: `npm run format-check`
- Format fix: `npm run format-write`
- Check all: `npm run check-all`

## Code style
- TypeScript strict mode

## Testing
- **Vitest** with jsdom
- Test files: `*.test.ts(x)` in `test/` folder

## Branching strategy
- Use feature branches named `feat/your-feature-name`
- Bugfix branches named `fix/your-bugfix-name`
- Use PRs to merge into `master` branch

## PR instructions
- Always run `check-all` script before committing
- Title format should be `feat: <message>` or `fix: <message>`
- Start description with capital letter using imperative mood (Add, Enable, Remove, etc.)
- Don't end with a period
- Don't repeat the type in the description

## Skills
- See [.github/skills](../.github/skills) for available skills and how to use them

## Plan Mode
- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- End every plan with a numbered list of concrete steps. This should be the last thing visible in the terminal.
- At the end of each plan, give me a list of unresolved questions to answer, if any.
