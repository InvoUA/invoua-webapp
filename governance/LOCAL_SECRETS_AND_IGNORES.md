# LOCAL_SECRETS_AND_IGNORES (INVOUA)

## Why
We keep runtime secrets and ephemeral artifacts **out of git** to prevent leakage and to keep PRs clean.

## Local secrets directory
Store any credentials/tokens only under:
- `.local/` (never committed)

Recommended structure:
- `.local/env.ps1` (PowerShell env exports)
- `.local/tokens/` (plain tokens, if absolutely needed)
- `.local/secrets/` (service creds)

Example `.local/env.ps1` (DO NOT COMMIT):
```powershell
$env:GH_TOKEN = "PASTE_LOCALLY"
$env:GITHUB_TOKEN = $env:GH_TOKEN
$env:INVOUA_N8N_API_KEY = "PASTE_LOCALLY"
```

## Generated artifacts directory
Store ephemeral outputs under:
- `.generated/` (never committed)

## Enforcement
Each repo must include in `.gitignore` at minimum:
- `.local/`
- `.generated/`
- `.env` / `.env.*`
- `env.ps1`
- any deploy registries / audit trails

## Verification commands
```powershell
git check-ignore -v .local/env.ps1
git check-ignore -v .env
git status
```
