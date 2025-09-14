// webapp_tg_bridge.js — перехоплює POST /api/invoices і шле дані в Telegram WebApp.
(function () {
  const tg = window.Telegram && window.Telegram.WebApp;
  const safeSend = (payload) => {
    try { tg && tg.sendData && tg.sendData(JSON.stringify(payload)); } catch(e) {}
  };
  const abs = (rel) => {
    if (!rel) return null;
    const base = (window.API_BASE || "").replace(/\/+$/,'');
    return base ? (base + rel) : rel;
  };

  // ---- fetch ----
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
            // підтримуємо обидва варіанти відповіді API
            const number = data.number || (data.invoice && data.invoice.number) || "";
            const pdf = data.pdf_url || (data.links && data.links.pdf && abs(data.links.pdf)) || null;
            const html = data.public_url || (data.links && data.links.html && abs(data.links.html)) || null;
            safeSend({ type: 'invoice_created', id: data.id, number, html_url: html, pdf_url: pdf });
          }
        }
      } catch (e) {}
      return res;
    };
  }

  // ---- XMLHttpRequest ----
  (function () {
    const XHR = window.XMLHttpRequest;
    if (!XHR) return;
    const origOpen = XHR.prototype.open;
    const origSend = XHR.prototype.send;

    XHR.prototype.open = function (method, url) {
      this.__invoua__ = { method: String(method || '').toUpperCase(), url: String(url || '') };
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
                const number = data.number || (data.invoice && data.invoice.number) || "";
                const pdf = data.pdf_url || (data.links && data.links.pdf && abs(data.links.pdf)) || null;
                const html = data.public_url || (data.links && data.links.html && abs(data.links.html)) || null;
                safeSend({ type: 'invoice_created', id: data.id, number, html_url: html, pdf_url: pdf });
              }
            }
          } catch (e) {}
        }
      });
      return origSend.apply(this, arguments);
    };
  })();
})();
