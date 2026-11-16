/* ==========================================================================
   Le passage : la transition entre l'accueil et un projet (puis le projet suivant)

   Contrat (BRIEF-V4.md, section 3) :
     <head>  <link rel="stylesheet" href="shared/passage.css">
     </body> <script src="shared/passage.js" defer></script>

   Départ : window.Passage.ouvrir(elementSource, url, { couleur: '#…' })
     - le rectangle de l'élément source grandit jusqu'à l'écran entier dans la couleur donnée
       (≈ 700 ms expo.out, léger flou au départ) ;
     - sessionStorage['kz-passage'] = JSON.stringify({ couleur, t: Date.now() }) ;
   Départ avec un élément partagé : Passage.ouvrir(imageSource, url, { couleur, icone: '<url de l'image>', taille: 112 })
     - la couleur remplit l'écran en cercle à partir de la source, pendant que l'icône s'en détache,
       grossit et se pose au centre de l'écran (taille px) ; ≈ 740 ms ;
     - sessionStorage['kz-passage'] = { couleur, icone, taille, t } : l'état final du départ
       (aplat plein écran, icône centrée) est exactement l'état initial de l'arrivée.
     - puis navigation vers url (si seule l'ancre change, la page est rechargée sous le voile).
     Renvoie une promesse (résolue quand la navigation part).
   Arrivée : si 'kz-passage' a moins de 6 s, un voile de cette couleur couvre l'écran dès
     l'exécution du script, puis se retire en se contractant vers le centre (≈ 800 ms) ;
     document reçoit « passage:arrivee » ; la clé est effacée.
   Arrivée avec l'icône : le voile montre l'icône au centre ; elle vole jusqu'à l'élément
     [data-passage-icone] de la page (FLIP sur sa boîte, ≈ 620 ms) et prend sa place, pendant que
     le voile se rétracte dans [data-passage-arche] s'il existe (sinon vers le centre), puis s'efface.
     La page peut montrer l'icône dès son premier rendu (avant ce script) en lisant la même clé.
     Pendant l'arrivée : window.Passage.arrivee === true et <html class="kz-passage-arrivee">.
   Mouvement réduit : fondus. GSAP si présent, sinon Web Animations API.
   ========================================================================== */
(function () {
  'use strict';
  if (window.Passage && window.Passage.pret) return;

  var D = document;
  var HTML = D.documentElement;
  var W = window;
  var CLE = 'kz-passage';
  var FRAIS = 6000;

  var G = (W.gsap && typeof W.gsap.to === 'function') ? W.gsap : null;
  var MQ = W.matchMedia ? W.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduit() { return !!(MQ && MQ.matches); }
  function at(s, fn) { return setTimeout(fn, s * 1000); }
  function px(n) { return (Math.round(n * 10) / 10) + 'px'; }
  function retirer(el) { if (el && el.parentNode) el.parentNode.removeChild(el); }

  /* GSAP si présent, sinon Web Animations. Propriétés : clipPath, opacity, filter. */
  var EZ = {
    expo: ['expo.out', 'cubic-bezier(.16,1,.3,1)'],
    contracte: ['power3.inOut', 'cubic-bezier(.7,0,.2,1)'],
    sortie: ['power2.out', 'cubic-bezier(.33,1,.68,1)'],
    doux: ['power2.inOut', 'cubic-bezier(.45,0,.55,1)'],
    pose: ['power3.inOut', 'cubic-bezier(.65,0,.25,1)']
  };
  function poser(el, s) { for (var k in s) el.style[k] = s[k]; }
  function anim(el, de, a, o) {
    o = o || {};
    var d = o.d || 0, delai = o.delay || 0, ez = EZ[o.e] || EZ.expo;
    return new Promise(function (ok) {
      if (G) {
        var v = {}, k;
        for (k in a) v[k] = a[k];
        v.duration = d; v.delay = delai; v.ease = ez[0]; v.overwrite = 'auto';
        v.onComplete = function () { ok(); };
        G.fromTo(el, de, v);
        return;
      }
      poser(el, de);
      if (!el.animate || d <= 0) { at(d + delai, function () { poser(el, a); ok(); }); return; }
      var an = el.animate([de, a], { duration: d * 1000, delay: delai * 1000, easing: ez[1], fill: 'both' });
      var fait = false;
      function fin() { if (fait) return; fait = true; ok(); }
      an.onfinish = function () { poser(el, a); try { an.cancel(); } catch (e) {} fin(); };
      an.oncancel = fin;
    });
  }

  /* Défilement bloqué pendant le départ */
  function bloq(e) { e.preventDefault(); }
  function bloqTouche(e) { if (/^(?: |Spacebar|PageDown|PageUp|ArrowDown|ArrowUp|Home|End)$/.test(e.key)) e.preventDefault(); }
  var OPT = { capture: true, passive: false }, BLOQUE = false;
  function bloquer(on) {
    if (BLOQUE === on) return;
    BLOQUE = on;
    var f = on ? 'addEventListener' : 'removeEventListener';
    W[f]('wheel', bloq, OPT);
    W[f]('touchmove', bloq, OPT);
    W[f]('keydown', bloqTouche, OPT);
  }

  function voile(couleur, icone, taille) {
    var v = D.createElement('div');
    v.className = 'kz-passage' + (icone ? ' kz-passage--icone' : '');
    v.setAttribute('aria-hidden', 'true');
    v.style.setProperty('--kz-passage', couleur);
    if (icone) v.style.setProperty('--kz-passage-t', (+taille || 112) + 'px');
    v.innerHTML = '<div class="kz-passage__in"></div>' +
      (icone ? '<img class="kz-passage__ico" alt="" draggable="false" src="' + String(icone).replace(/"/g, '&quot;') + '">' : '');
    (D.body || HTML).appendChild(v);
    return { el: v, in: v.firstChild, ico: v.querySelector('.kz-passage__ico') };
  }

  function couleurDe(el) {
    try {
      var c = getComputedStyle(el).backgroundColor;
      if (c && !/^(transparent|rgba\(\s*0,\s*0,\s*0,\s*0\s*\))$/i.test(c)) return c;
    } catch (e) {}
    return '';
  }
  function rayonDe(el, r) {
    try {
      var v = getComputedStyle(el).borderTopLeftRadius || '0';
      var n = parseFloat(v) || 0;
      if (/%$/.test(v)) n = Math.min(r.width, r.height) * n / 100;
      return Math.min(n, Math.min(r.width, r.height) / 2);
    } catch (e) { return 0; }
  }

  /* ------------------------------------------------------------------------
     Départ
     ------------------------------------------------------------------------ */
  var EN_COURS = false, SECOURS = 0;

  function ouvrir(el, url, opts) {
    opts = opts || {};
    if (!url) return Promise.resolve(false);
    if (EN_COURS) return Promise.resolve(false);
    var u;
    try { u = new URL(url, location.href); } catch (e) { location.href = url; return Promise.resolve(true); }
    EN_COURS = true;
    var couleur = opts.couleur || (el && couleurDe(el)) || '#0E1220';
    var vw = W.innerWidth, vh = W.innerHeight;
    var r = (el && el.getBoundingClientRect) ? el.getBoundingClientRect() : null;
    if (!r || (!r.width && !r.height)) r = { left: vw / 2 - 40, top: vh / 2 - 40, right: vw / 2 + 40, bottom: vh / 2 + 40, width: 80, height: 80 };
    var t = Math.max(0, Math.min(vh, r.top)), b = Math.max(0, Math.min(vh, vh - r.bottom));
    var l = Math.max(0, Math.min(vw, r.left)), d = Math.max(0, Math.min(vw, vw - r.right));
    var rad = el ? rayonDe(el, r) : 24;
    var ico = opts.icone ? String(opts.icone) : '', T = +opts.taille || 112;
    var V = voile(couleur, ico, T);
    bloquer(true);
    var p;
    if (ico && V.ico) {
      /* L'élément partagé : la couleur s'étend en cercle depuis la source, l'icône se pose au centre */
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var R0 = Math.max(4, Math.min(r.width, r.height) * .55);
      var R1 = Math.ceil(Math.sqrt(Math.pow(Math.max(cx, vw - cx), 2) + Math.pow(Math.max(cy, vh - cy), 2))) + 2;
      if (reduit()) {
        p = anim(V.el, { opacity: '0' }, { opacity: '1' }, { d: 0.32, e: 'doux' });
      } else {
        p = anim(V.in, { clipPath: 'circle(' + px(R0) + ' at ' + px(cx) + ' ' + px(cy) + ')' },
          { clipPath: 'circle(' + px(R1) + ' at ' + px(cx) + ' ' + px(cy) + ')' }, { d: 0.74, e: 'contracte' });
        anim(V.ico, { transform: 'translate(' + px(cx - vw / 2) + ',' + px(cy - vh / 2) + ') scale(' + (r.width / T).toFixed(4) + ')' },
          { transform: 'translate(0px,0px) scale(1)' }, { d: 0.74, e: 'pose' });
      }
      return p.then(function () { return partir(u, couleur, V, { icone: ico, taille: T }); });
    }
    if (reduit()) {
      p = anim(V.el, { opacity: '0' }, { opacity: '1' }, { d: 0.32, e: 'doux' });
    } else {
      p = anim(V.in, { clipPath: 'inset(' + px(t) + ' ' + px(d) + ' ' + px(b) + ' ' + px(l) + ' round ' + px(rad) + ')' },
        { clipPath: 'inset(0px 0px 0px 0px round 0px)' }, { d: 0.7, e: 'expo' });
      anim(V.el, { filter: 'blur(10px)' }, { filter: 'blur(0px)' }, { d: 0.42, e: 'sortie' });
    }
    return p.then(function () { return partir(u, couleur, V); });
  }

  function partir(u, couleur, V, plus) {
    var st = { couleur: couleur, t: Date.now() };
    if (plus && plus.icone) { st.icone = plus.icone; st.taille = plus.taille; }
    try { sessionStorage.setItem(CLE, JSON.stringify(st)); } catch (e) {}
    clearTimeout(SECOURS);
    SECOURS = at(6, function () { liberer(); });   /* navigation bloquée : on rend la main */
    return new Promise(function (ok) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          var meme = u.origin === location.origin && u.pathname === location.pathname && u.search === location.search;
          if (meme) {
            /* Seule l'ancre change (app.html#oshii -> #sago) : on recharge, l'arrivée se joue sous le voile. */
            if (u.hash !== location.hash) location.href = u.href;
            location.reload();
          } else {
            location.href = u.href;
          }
          ok(true);
        });
      });
    });
  }

  function liberer() {
    clearTimeout(SECOURS);
    Array.prototype.slice.call(D.querySelectorAll('.kz-passage')).forEach(retirer);
    HTML.classList.remove('kz-passage-arrivee');
    bloquer(false);
    EN_COURS = false;
  }

  /* ------------------------------------------------------------------------
     Arrivée
     ------------------------------------------------------------------------ */
  function arriver() {
    var st = null;
    try { st = JSON.parse(sessionStorage.getItem(CLE) || 'null'); } catch (e) {}
    try { sessionStorage.removeItem(CLE); } catch (e) {}
    if (!st || !st.couleur || !(Date.now() - (+st.t || 0) < FRAIS)) return;

    W.Passage.arrivee = true;
    HTML.classList.add('kz-passage-arrivee');
    var V = voile(st.couleur, st.icone, st.taille);
    var signale = false, fini = false;
    function signal() {
      if (signale) return;
      signale = true;
      try { D.dispatchEvent(new CustomEvent('passage:arrivee', { bubbles: true })); } catch (e) {}
    }
    function fin() {
      if (fini) return;
      fini = true;
      signal();
      retirer(V.el);
      HTML.classList.remove('kz-passage-arrivee');
      W.Passage.arrivee = false;
    }
    at(3.5, fin);   /* garde-fou */
    if (st.icone && V.ico) { arriverIcone(V, st, signal, fin); return; }

    if (reduit()) {
      at(0.05, function () {
        at(0.12, signal);
        anim(V.el, { opacity: '1' }, { opacity: '0' }, { d: 0.42, e: 'sortie' }).then(fin);
      });
      return;
    }
    /* Une image pleine, puis le voile se contracte vers le centre et s'efface en arrivant. */
    requestAnimationFrame(function () {
      at(0.08, function () {
        anim(V.in, { clipPath: 'inset(0% 0% 0% 0% round 0px)' }, { clipPath: 'inset(50% 50% 50% 50% round 40px)' }, { d: 0.8, e: 'contracte' }).then(fin);
        anim(V.el, { opacity: '1' }, { opacity: '0' }, { d: 0.3, delay: 0.5, e: 'sortie' });
        at(0.24, signal);
      });
    });
  }

  /* L'icône du voile vole jusqu'à sa place sur la page ; le voile se rétracte dans l'arche de lumière */
  function poserCible(c) { if (!c) return; c.style.transition = 'none'; c.style.transform = 'none'; c.style.opacity = '1'; }
  function arriverIcone(V, st, signal, fin) {
    var c0 = D.querySelector('[data-passage-icone]');
    if (c0) c0.style.opacity = '0';
    var parti = false;
    var go = function () {
      if (parti) return;
      parti = true;
      var cible = D.querySelector('[data-passage-icone]'), arche = D.querySelector('[data-passage-arche]');
      signal();
      if (reduit() || !cible) {
        poserCible(cible);
        anim(V.el, { opacity: '1' }, { opacity: '0' }, { d: 0.42, e: 'sortie' }).then(fin);
        return;
      }
      cible.style.opacity = '0';
      var vw = W.innerWidth, vh = W.innerHeight, T = +st.taille || 112;
      var r = cible.getBoundingClientRect(), w = cible.offsetWidth || r.width;
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var vol = anim(V.ico, { transform: 'translate(0px,0px) scale(1)' },
        { transform: 'translate(' + px(cx - vw / 2) + ',' + px(cy - vh / 2) + ') scale(' + (w / T).toFixed(4) + ')' }, { d: 0.62, e: 'pose' })
        .then(function () { poserCible(cible); retirer(V.ico); });
      var vers = 'inset(50% 50% 50% 50% round 40px 40px 40px 40px)';
      if (arche) {
        var a = arche.getBoundingClientRect(), R = px(a.width / 2);
        vers = 'inset(' + px(Math.max(0, a.top)) + ' ' + px(Math.max(0, vw - a.right)) + ' ' + px(Math.max(0, vh - a.bottom)) + ' ' + px(Math.max(0, a.left)) + ' round ' + R + ' ' + R + ' 0px 0px)';
      }
      anim(V.in, { clipPath: 'inset(0px 0px 0px 0px round 0px 0px 0px 0px)' }, { clipPath: vers }, { d: 0.7, e: 'contracte' });
      var efface = anim(V.in, { opacity: '1' }, { opacity: '0' }, { d: 0.36, delay: 0.5, e: 'sortie' });
      Promise.all([vol, efface]).then(fin);
    };
    /* La place de l'icône dépend des polices de la page : on les attend un instant */
    requestAnimationFrame(function () {
      var f = D.fonts && D.fonts.ready;
      var t = new Promise(function (ok) { at(0.65, ok); });
      (f ? Promise.race([f, t]) : t).then(function () { at(0.06, go); }, function () { at(0.06, go); });
    });
  }

  W.Passage = { pret: true, arrivee: false, ouvrir: ouvrir };

  /* Retour arrière depuis la page suivante (cache) : on rend la page intacte. */
  W.addEventListener('pageshow', function (e) { if (e.persisted) liberer(); });

  arriver();
})();
