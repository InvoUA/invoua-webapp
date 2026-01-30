# _legacy_webapp

Ця папка містить **заморожену копію** legacy Telegram Web App фронтенду (статичні файли),
щоб можна було безпечно рефакторити корінь репозиторію та не ламати GitHub Pages.

## Що тут є
- `index.html` — legacy UI
- `app-v2.html` — legacy v2
- `webapp_tg_bridge.js` — інтеграція з Telegram Web App
- `fonts/` — шрифти, потрібні legacy UI

## Важливо
- Це **копія**. Root-файли репо поки не чіпаємо, щоб `invoua.com` (GitHub Pages) працював.
- Мета: поступово переносити/оновлювати, але legacy зберігати як “референс”.
