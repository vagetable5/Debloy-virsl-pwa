// pwa.js — Service Worker রেজিস্টার + পেজের উপরে "অ্যাপ ডাউনলোড" বাটন
(function () {
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }

  var standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  if (standalone) return; // অ্যাপ হিসেবে খোলা থাকলে বাটন দরকার নেই

  var dp = null, ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  try { if (localStorage.getItem('vv_installed') === '1') return; } catch (e) {}

  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); dp = e; });
  window.addEventListener('appinstalled', function () {
    try { localStorage.setItem('vv_installed', '1'); } catch (e) {}
    var b = document.getElementById('pwa-bar'); if (b) b.remove();
  });

  function help() {
    var old = document.getElementById('pwa-help'); if (old) old.remove();
    var o = document.createElement('div'); o.id = 'pwa-help';
    o.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:#000b;display:flex;align-items:center;justify-content:center;padding:16px';
    var b = document.createElement('div');
    b.style.cssText = 'max-width:340px;width:100%;background:#18182b;border:1px solid #b44cff;border-radius:16px;padding:20px;color:#eee;font:14px/1.8 system-ui,sans-serif';
    var t = document.createElement('p');
    t.style.margin = '0 0 12px';
    t.textContent = ios
      ? 'iPhone/iPad এ: Safari এর নিচের "Share" (⬆️) বাটনে চাপুন → "Add to Home Screen" বেছে নিন।'
      : 'ব্রাউজারের মেনু (⋮) খুলে "Install app" বা "Add to Home screen" বেছে নিন।';
    var c = document.createElement('button');
    c.textContent = 'ঠিক আছে';
    c.style.cssText = 'background:linear-gradient(135deg,#b44cff,#00e5ff);border:0;color:#fff;border-radius:8px;padding:9px 18px;font:inherit;cursor:pointer';
    c.onclick = function () { o.remove(); };
    b.appendChild(t); b.appendChild(c); o.appendChild(b);
    o.onclick = function (e) { if (e.target === o) o.remove(); };
    document.body.appendChild(o);
  }

  function bar() {
    if (document.getElementById('pwa-bar')) return;
    var d = document.createElement('div'); d.id = 'pwa-bar';
    d.style.cssText = 'display:flex;gap:8px;align-items:center;justify-content:center;padding:8px 10px;background:linear-gradient(135deg,#b44cff,#00e5ff);color:#fff;font:600 14px system-ui,sans-serif';
    var s = document.createElement('span'); s.textContent = '📲 ফোনে অ্যাপ হিসেবে ব্যবহার করুন';
    var b = document.createElement('button'); b.textContent = '⬇ ডাউনলোড';
    b.style.cssText = 'background:#fff;color:#4a1a7a;border:0;border-radius:18px;padding:6px 14px;font:700 13px system-ui,sans-serif;cursor:pointer';
    b.onclick = function () {
      if (dp) { dp.prompt(); dp.userChoice.finally(function () { dp = null; }); } else help();
    };
    var x = document.createElement('button'); x.textContent = '×'; x.setAttribute('aria-label', 'বন্ধ করুন');
    x.style.cssText = 'background:0;border:0;color:#fff;font-size:22px;line-height:1;cursor:pointer;padding:0 4px';
    x.onclick = function () { d.remove(); try { sessionStorage.setItem('vv_bar_x', '1'); } catch (e) {} };
    d.appendChild(s); d.appendChild(b); d.appendChild(x);
    document.body.insertBefore(d, document.body.firstChild);
  }

  document.addEventListener('DOMContentLoaded', function () {
    try { if (sessionStorage.getItem('vv_bar_x') === '1') return; } catch (e) {}
    bar();
  });
})();
