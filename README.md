# InvoUA — Invoice in 60 seconds

This repository hosts the legacy Telegram Web App frontend
that was previously used for InvoUA.

⚠️ Status (2026):
- Core business logic moved to n8n (Docker, self-hosted)
- Backend: FastAPI
- This frontend is kept for compatibility and reference
- Active restructuring in progress

## Architecture (current)
- Telegram Bot
- n8n workflows (primary logic)
- FastAPI backend
- GitHub Pages used only for legacy frontend

## Notes
- Do NOT remove files from root without migration plan
- Legacy code will be moved to /_legacy_webapp step-by-step
