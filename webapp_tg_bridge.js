// InvoUA Telegram WebApp bridge: відправляє у бот факт створення інвойсу
(function () {
  const tg = window.Telegram && window.Telegram.WebApp;
  function sendToBot(payload) {
    try { tg && tg.sendData && tg.sendData(JSON.stringify(payload)); } catch(e) {}
  }

  // Перехоплення fetch
  const origFetch = window.fetch;
  if (origFetch) {
    window.fetch = async function (input, init) {
      const res = await origFetch(input, init);
      try {
        const url = (typeof input === 'string') ? input : (input && input.url) || '';
        const method = (init && init.method) ? String(init.method).toUpperCase() : 'GET';
        if (/\/api\/invoices(\?|$)/i.test(url) && method === 'POST' && res.ok) {
          const clone = res.clone();
          const data = await clone.json().catch(() => null);
          if (data && data.id) {
            sendToBot({
              type: 'invoice_created',
              id: data.id,
              number: data.number,
              html_url: data.public_url,
              pdf_url: data.pdf_url
            });
          }
        }
      } catch(e) {}
      return res;
    };
  }

  // Перехоплення XHR (на випадок, якщо фронт не на fetch)
  (function () {
    const XHR = window.XMLHttpRequest;
    if (!XHR) return;
    const origOpen = XHR.prototype.open;
    const origSend = XHR.prototype.send;

    XHR.prototype.open = function (method, url) {
      this.__invoua__ = { method: String(method||'').toUpperCase(), url: String(url||'') };
      return origOpen.apply(this, arguments);
    };
    XHR.prototype.send = function (body) {
      const self = this;
      const meta = self.__invoua__ || {};
      this.addEventListener('readystatechange', function () {
        if (self.readyState === 4) {
          try {
            if (/\/api\/invoices(\?|$)/i.test(meta.url) && meta.method === 'POST' && self.status >= 200 && self.status < 300) {
              const data = JSON.parse(self.responseText);
              if (data && data.id) {
                sendToBot({
                  type: 'invoice_created',
                  id: data.id,
                  number: data.number,
                  html_url: data.public_url,
                  pdf_url: data.pdf_url
                });
              }
            }
          } catch(e) {}
        }
      });
      return origSend.apply(this, arguments);
    };
  })();
})();
