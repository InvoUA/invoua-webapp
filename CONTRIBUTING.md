# Contributing

## Rules
- Direct pushes to `main` are blocked. Use Pull Requests.
- Branch naming:
  - `feat/...` new features
  - `fix/...` bug fixes
  - `docs/...` documentation
  - `chore/...` maintenance
  - `refactor/...` refactors

## Typical flow
1. `git switch main && git pull`
2. `git switch -c <type>/<short-name>`
3. edit files
4. `git add -A && git commit -m "<type>: <message>"`
5. `git push -u origin <branch>`
6. create PR and merge
