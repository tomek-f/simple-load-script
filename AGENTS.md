# AGENTS.md

The role of this file is to describe common mistakes and confusion points that agents might encounter as they work in this project. If you ever encounter something in the project that surprises you, please alert the developer working with you and indicate that this is the case in the AgentMD file to help prevent future agents from having the same issue.

## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- End every plan with a numbered list of concrete steps. This should be the last thing visible in the terminal.
- At the end of each plan, give me a list of unresolved questions to answer, if any.

## Gotchas

- `attw --pack` fails (`npm pack` → `EBADDEVENGINES`, `devEngines` requires pnpm). Use `pnpm check-package`, which packs with pnpm.
- jsdom does not load scripts; tests use `mockScriptLoad` (`test/utils.ts`) to fire `load`/`error`.

## Documentation

- [Git Workflow](docs/git-workflow.md)
