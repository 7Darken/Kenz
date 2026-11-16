/* Outil de revue des maquettes (pour Kenz, pas pour le site final).
   Une pastille en bas à gauche : retour à l'accueil + choix du style.
   Changer de style ouvre la MÊME page dans l'autre style, au même endroit (à peu près). */
(function () {
  'use strict';
  var STYLES = [
    { id: 'golden', nom: 'Golden hour', a: '#0E1220', b: '#E3A25A' },
    { id: 'studio', nom: 'Studio', a: '#F1EFEA', b: '#1A1918' },
    { id: 'portraits', nom: 'Deux portraits', a: '#F7F5F1', b: '#0F5D6B' },
    { id: 'fil', nom: 'Le fil', a: '#1A1918', b: '#2A8C9C' }
  ];
  var KEY = 'kz-revue';
  var parts = location.pathname.split('/');
  var file = parts.pop() || 'pro.html';
  var current = parts.pop();
  if (!STYLES.some(function (s) { return s.id === current; })) return;

  function store(v) { try { sessionStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  function read() { try { var v = JSON.parse(sessionStorage.getItem(KEY) || 'null'); sessionStorage.removeItem(KEY); return v; } catch (e) { return null; } }

  var css = document.createElement('style');
  css.textContent = [
    '.kz-revue{position:fixed;left:max(12px,env(safe-area-inset-left,0px));bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:2147483000;display:flex;align-items:center;gap:4px;padding:4px;border-radius:999px;font:500 13px/1 "Inter",system-ui,-apple-system,sans-serif;color:#F4EFE6;background:rgba(18,17,16,.62);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);box-shadow:0 0 0 1px rgba(255,255,255,.14) inset,0 14px 34px -14px rgba(0,0,0,.55);opacity:.78;transition:opacity .3s}',
    '.kz-revue:hover,.kz-revue:focus-within,.kz-revue.is-open{opacity:1}',
    '.kz-revue a,.kz-revue button{all:unset;box-sizing:border-box;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 11px;border-radius:999px;color:inherit;white-space:nowrap;transition:background .3s}',
    '.kz-revue a:hover,.kz-revue button:hover{background:rgba(255,255,255,.1)}',
    '.kz-revue a:focus-visible,.kz-revue button:focus-visible{outline:2px solid #F4EFE6;outline-offset:1px}',
    '.kz-revue .sw{width:12px;height:12px;border-radius:50%;box-shadow:0 0 0 1px rgba(255,255,255,.35) inset;flex:none}',
    '.kz-revue .list{display:flex;gap:2px;max-width:0;overflow:hidden;opacity:0;transition:max-width .6s cubic-bezier(.16,1,.3,1),opacity .3s}',
    '.kz-revue.is-open .list{max-width:560px;opacity:1}',
    '.kz-revue .list button[aria-current="true"]{background:rgba(255,255,255,.16)}',
    '.kz-revue .sep{width:1px;height:18px;background:rgba(255,255,255,.16)}',
    'html.kz-passage-arrivee .kz-revue,html[data-porte-arrivee] .kz-revue{opacity:0}',
    '@media (max-width:560px){.kz-revue .lbl{display:none}.kz-revue.is-open .list button .lbl{display:inline}.kz-revue.is-open .list{max-width:80vw;flex-wrap:wrap}}'
  ].join('\n');
  document.head.appendChild(css);

  var cur = STYLES.filter(function (s) { return s.id === current; })[0];
  var bar = document.createElement('nav');
  bar.className = 'kz-revue';
  bar.setAttribute('aria-label', 'Revue des maquettes');
  var sw = function (s) { return '<span class="sw" style="background:linear-gradient(135deg,' + s.a + ' 50%,' + s.b + ' 50%)"></span>'; };
  bar.innerHTML =
    '<a href="../index.html" aria-label="Accueil des maquettes">←</a><span class="sep"></span>' +
    '<button type="button" class="toggle" aria-expanded="false">' + sw(cur) + '<span class="lbl">Style : ' + cur.nom + '</span></button>' +
    '<span class="list">' + STYLES.map(function (s) {
      return '<button type="button" data-style="' + s.id + '"' + (s.id === current ? ' aria-current="true"' : '') + '>' + sw(s) + '<span class="lbl">' + s.nom + '</span></button>';
    }).join('') + '</span>';
  document.body.appendChild(bar);

  var toggle = bar.querySelector('.toggle');
  function setOpen(v) { bar.classList.toggle('is-open', v); toggle.setAttribute('aria-expanded', String(v)); }
  toggle.addEventListener('click', function () { setOpen(!bar.classList.contains('is-open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  document.addEventListener('pointerdown', function (e) { if (!bar.contains(e.target)) setOpen(false); });

  bar.querySelectorAll('[data-style]').forEach(function (b) {
    b.addEventListener('click', function () {
      var id = b.getAttribute('data-style');
      if (id === current) { setOpen(false); return; }
      var max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      store({ ratio: scrollY / max, t: Date.now() });
      location.href = '../' + id + '/' + file + location.hash;
    });
  });

  var back = read();
  if (back && Date.now() - back.t < 15000 && back.ratio > 0.02) {
    setTimeout(function () {
      var max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      var y = Math.round(back.ratio * max);
      if (window.lenis && window.lenis.scrollTo) window.lenis.scrollTo(y, { immediate: true });
      else window.scrollTo(0, y);
    }, 1300);
  }
})();
