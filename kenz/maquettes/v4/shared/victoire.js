/* ==========================================================================
   Victoire : « 54 heures » (module partagé des 4 styles, brief V5)

   Dans la page :
     <head>   <link rel="stylesheet" href="../shared/victoire.css">
     <body>   <section id="victoire" class="kz-victoire" data-kz-victoire data-theme="dark"
                       aria-label="Startup Weekend"></section>
     fin      GSAP 3.12.5 + ScrollTrigger (facultatifs, chargés AVANT), puis
              <script src="../shared/victoire.js"></script>
   Le script remplit chaque [data-kz-victoire] et gère lui-même son épinglage.
   Les photos sont cherchées dans ../assets/img/ à partir de l'adresse du script ;
   data-img="…/img/" sur la section remplace ce chemin.

   La séquence :
     1. 54:00:00. Les chiffres montent d'une fente. « Startup Weekend, Grenoble. »
     2. Vendredi soir. « Une idée, des inconnus. » Le compteur file vers 50 h ; des points épars,
        six s'allument et se rassemblent : l'équipe.
     3. Samedi. « On construit. » Le tirage de l'équipe se pose, les six points rejoignent
        les six visages, le feutre trace cadres et flèches sur le tableau blanc.
     4. Dimanche. « Le pitch, devant le jury. » La lumière baisse, le compteur ralentit vers 00:00:00.
     5. 00:00:00 : l'éclat. La photo de l'annonce s'ouvre en iris, « La première place. »,
        puis le tirage du chèque se pose.
     6. « 54 heures pour transformer une idée en projet. »

   Modes :
     - ordinateur ≥ 900 × 600 avec GSAP + ScrollTrigger, sans mouvement réduit : la section est
       épinglée et la séquence suit le défilement ;
     - sinon (mobile, pas de GSAP) : les six temps se suivent, chacun joué à son entrée ;
     - mouvement réduit : fondus, compteurs posés à leur valeur.

   API : window.KzVictoire.init(section) (appelé tout seul au chargement),
         window.KzVictoire.refresh() (recalcule l'épinglage après un changement de mise en page).
   Événement : « victoire:pret » sur la section quand elle est remplie.
   ========================================================================== */
(function () {
  'use strict';
  var D = document, W = window;
  if (W.KzVictoire) return;

  var SRC = (D.currentScript && D.currentScript.src) || '';
  var RMQ = W.matchMedia ? W.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var PIN_Q = '(min-width: 900px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)';
  var H54 = 54 * 3600, H50 = 50 * 3600, H24 = 24 * 3600;

  /* Les points : 44 inconnus, dont 6 deviendront l'équipe */
  var N = 44, TEAM = [3, 10, 17, 25, 32, 39];
  /* L'équipe en hexagone (haut, puis dans le sens des aiguilles d'une montre) */
  var ANG = [-90, -30, 30, 90, 150, 210].map(function (a) { return a * Math.PI / 180; });
  /* Les six visages sur startup-weekend-3.jpg (en %), dans l'ordre de l'hexagone */
  var FACES = [[49.8, 25], [75, 31.3], [79.1, 56.8], [48.3, 52.3], [16.7, 59.8], [29.1, 42.9]];
  /* Le feutre sur le tableau blanc (repère 900 × 1200), loin des visages, sans texte */
  var TRAITS = [
    'M316 131C345 127 378 127 401 130C404 151 404 171 402 192C372 195 341 195 313 193C310 172 310 150 314 126',
    'M214 70C252 56 291 74 307 116M293 109L308 119L311 101',
    'M650 100C612 86 520 88 482 100C458 108 466 128 500 134C560 143 640 138 664 122C676 112 662 101 628 95',
    'M766 188C800 184 846 187 886 182',
    'M94 394C82 395 78 400 78 410L77 462C77 472 82 476 95 476'
  ];
  var PRINT_ROT = -2.5, CHEQUE_ROT = 3.5;

  /* Tirages pseudo-aléatoires fixes : la scène est toujours la même */
  function rng(a) {
    return function () {
      a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  var R0 = rng(54), PTS = [], DL = [], SP = [], i, k;
  for (i = 0; i < N; i++) {                       /* le meilleur de 16 candidats : des points bien répartis */
    var best = null, bd = -1;
    for (k = 0; k < 16; k++) {
      var p = [R0(), R0()], d = 9;
      for (var j = 0; j < PTS.length; j++) {
        var dx = p[0] - PTS[j][0], dy = p[1] - PTS[j][1];
        d = Math.min(d, dx * dx + dy * dy);
      }
      if (d > bd) { bd = d; best = p; }
    }
    PTS.push(best);
  }
  for (i = 0; i < N; i++) DL.push(R0());
  for (i = 0; i < 10; i++) {
    var a = i / 10 * Math.PI * 2 + (R0() - .5) * .5, r = 70 + R0() * 80;
    SP.push([Math.cos(a) * r, Math.sin(a) * r * .8]);
  }

  /* ---------- Le compteur ---------- */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function fmt(s) {
    s = Math.max(0, Math.ceil(s - 1e-6));
    return pad(Math.floor(s / 3600)) + pad(Math.floor(s % 3600 / 60)) + pad(s % 60);
  }
  function clockHTML(v) {
    var str = fmt(v), h = '', n = 0;
    for (var x = 0; x < 8; x++) {
      if (x === 2 || x === 5) h += '<span class="kv-sep">:</span>';
      else { h += '<span class="kv-slot' + (str[n] === '0' ? ' is-0' : '') + '"><span class="kv-dg" style="--i:' + n + '">' + str[n] + '</span></span>'; n++; }
    }
    return h;
  }
  function setClock(groups, v) {
    var str = fmt(v);
    for (var g = 0; g < groups.length; g++) {
      var dg = groups[g];
      for (var x = 0; x < 6; x++) {
        if (dg[x].textContent === str[x]) continue;
        dg[x].textContent = str[x];
        dg[x].parentNode.classList.toggle('is-0', str[x] === '0');   /* le zéro de Melodrama est large : resserré */
      }
    }
  }
  function words(t) {
    return t.split(' ').map(function (w, n) { return '<span class="kv-w" style="--i:' + n + '">' + w + '</span>'; }).join(' ');
  }
  function imgBase(sec) {
    var d = sec.getAttribute('data-img');
    try { return d ? new URL(d, location.href).href : new URL('../assets/img/', SRC || location.href).href; }
    catch (e) { return d || '../assets/img/'; }
  }

  /* ---------- Le contenu ---------- */
  function build(sec) {
    var IMG = imgBase(sec), dots = '', sparks = '', x;
    for (x = 0; x < N; x++) {
      var t = TEAM.indexOf(x);
      dots += t > -1
        ? '<i class="kv-dot kv-dot--team" style="--i:' + x + ';--k:' + t + '"><b></b></i>'
        : '<i class="kv-dot" style="--i:' + x + '"></i>';
    }
    for (x = 0; x < SP.length; x++) {
      sparks += '<i style="--i:' + x + ';--sx:' + SP[x][0].toFixed(1) + 'px;--sy:' + SP[x][1].toFixed(1) + 'px"></i>';
    }
    var fps = FACES.map(function (f) { return '<i class="kv-fp" style="left:' + f[0] + '%;top:' + f[1] + '%"></i>'; }).join('');
    var traits = TRAITS.map(function (dd, n) { return '<path class="kv-trait" pathLength="1" style="--i:' + n + '" d="' + dd + '"/>'; }).join('');
    var day = function (cls, d, l, mini) {
      return '<div class="kv-col">' +
        '<div class="kv-mini' + (cls || '') + '" aria-hidden="true">' + clockHTML(mini) + '</div>' +
        '<p class="kv-day">' + words(d) + '</p>' +
        '<p class="kv-line">' + l + '</p>' +
      '</div>';
    };

    sec.innerHTML =
      '<div class="kv-stage">' +
        '<i class="kv-glow" aria-hidden="true"></i>' +
        '<i class="kv-probe" aria-hidden="true"></i>' +

        '<div class="kv-t kv-t1">' +
          '<div class="kv-clock" aria-hidden="true">' +
            '<span class="kv-face">' + clockHTML(H54) + '</span>' +
            '<span class="kv-face kv-face--lux">' + clockHTML(H54) + '</span>' +
          '</div>' +
          '<p class="kv-sr">54 heures, du vendredi soir au dimanche soir.</p>' +
          '<p class="kv-cap">Startup Weekend, Grenoble.</p>' +
        '</div>' +

        '<div class="kv-t kv-t2">' +
          day('', 'Vendredi soir', 'Une idée, des inconnus.', H54) +
          '<div class="kv-field" aria-hidden="true">' +
            '<svg class="kv-ring" viewBox="-100 -100 200 200" focusable="false"><path pathLength="1" d="M0 -60L51.96 -30L51.96 30L0 60L-51.96 30L-51.96 -30Z"/></svg>' +
            dots +
          '</div>' +
        '</div>' +

        '<div class="kv-t kv-t3">' +
          day('', 'Samedi', 'On construit.', H50) +
          '<figure class="kv-print kv-print--equipe">' +
            '<span class="kv-print__img">' +
              '<img src="' + IMG + 'startup-weekend-3.jpg" alt="L’équipe de six, réunie devant le tableau blanc couvert de recherches." width="900" height="1200" loading="lazy" decoding="async">' +
              '<svg class="kv-traits" viewBox="0 0 900 1200" preserveAspectRatio="none" aria-hidden="true" focusable="false">' + traits + '</svg>' +
              fps +
            '</span>' +
          '</figure>' +
        '</div>' +

        '<div class="kv-t kv-t4">' +
          '<i class="kv-night" aria-hidden="true"></i>' +
          day(' kv-mini--lux', 'Dimanche', 'Le pitch, devant le jury.', H24) +
          '<i class="kv-flash" aria-hidden="true"></i>' +
          '<span class="kv-sparks" aria-hidden="true">' + sparks + '</span>' +
        '</div>' +

        '<div class="kv-t kv-t5">' +
          '<figure class="kv-photo">' +
            '<div class="kv-iris">' +
              '<img class="kv-photo__img" src="' + IMG + 'startup-weekend-2.jpg" alt="Kenz, bras levés, au moment de l’annonce, au milieu du public qui applaudit." width="1200" height="800" loading="lazy" decoding="async">' +
              '<i class="kv-photo__shade" aria-hidden="true"></i>' +
              '<i class="kv-photo__glow" aria-hidden="true"></i>' +
              '<span class="kv-credit">Photo&nbsp;: Annie Frénot</span>' +
            '</div>' +
          '</figure>' +
          '<h2 class="kv-title">' +
            '<span class="kv-l"><span class="kv-w" style="--i:0">La</span> <span class="kv-w" style="--i:1"><em>première</em></span></span> ' +
            '<span class="kv-l"><span class="kv-w" style="--i:2">place.</span></span>' +
          '</h2>' +
          '<figure class="kv-print kv-print--cheque">' +
            '<span class="kv-print__img"><img src="' + IMG + 'startup-weekend-1.jpg" alt="L’équipe sur scène avec le chèque géant du Techstars Startup Weekend Grenoble, 15e anniversaire." width="1200" height="900" loading="lazy" decoding="async"></span>' +
          '</figure>' +
        '</div>' +

        '<div class="kv-t kv-t6">' +
          '<p class="kv-end">54 heures pour transformer une idée en projet.</p>' +
        '</div>' +
      '</div>';

    var q = function (s) { return sec.querySelector(s); };
    var qa = function (s, root) { return Array.prototype.slice.call((root || sec).querySelectorAll(s)); };
    var R = {
      sec: sec, stage: q('.kv-stage'), ts: qa('.kv-t'),
      t1: q('.kv-t1'), t2: q('.kv-t2'), t3: q('.kv-t3'), t4: q('.kv-t4'), t5: q('.kv-t5'), t6: q('.kv-t6'),
      glow: q('.kv-glow'), probe: q('.kv-probe'),
      clock: q('.kv-clock'), seps: qa('.kv-face:not(.kv-face--lux) .kv-sep'), faceInk: q('.kv-face'), faceLux: q('.kv-face--lux'), cap: q('.kv-cap'),
      field: q('.kv-field'), ring: q('.kv-ring'), ringPath: q('.kv-ring path'), dots: qa('.kv-dot'),
      print: q('.kv-print--equipe'), fps: qa('.kv-fp'), traits: qa('.kv-trait'),
      night: q('.kv-night'), flash: q('.kv-flash'), sparks: qa('.kv-sparks i'),
      photo: q('.kv-photo'), iris: q('.kv-iris'), pglow: q('.kv-photo__glow'), credit: q('.kv-credit'),
      tw: qa('.kv-title .kv-w'), cheque: q('.kv-print--cheque'), end: q('.kv-end')
    };
    R.mini2 = q('.kv-t2 .kv-mini');
    R.dg = {
      clock: [qa('.kv-dg', R.faceInk), qa('.kv-dg', R.faceLux)],
      m2: [qa('.kv-dg', R.mini2)], m3: [qa('.kv-t3 .kv-mini .kv-dg')], m4: [qa('.kv-t4 .kv-mini .kv-dg')]
    };
    R.day = {};
    [2, 3, 4].forEach(function (n) { var t = R['t' + n]; R.day[n] = { w: qa('.kv-day .kv-w', t), line: q('.kv-t' + n + ' .kv-line') }; });
    return R;
  }

  /* Position d'un élément dans la scène, sans ses transformations */
  function box(el, root) {
    var x = 0, y = 0, e = el;
    while (e && e !== root) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    return { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight };
  }
  function resetMinis(R) {
    setClock(R.dg.m2, H54); setClock(R.dg.m3, H50); setClock(R.dg.m4, H24);
  }

  /* =========================================================
     Mode « à la suite » : chaque temps se joue à son entrée
     ========================================================= */
  function flow(R) {
    var sec = R.sec, rm = !!(RMQ && RMQ.matches), timers = [], alive = true, io = null, rt = 0;
    sec.classList.add('is-flow');
    sec.classList.toggle('is-rm', rm);

    function layout() {
      var f = R.field, Wd = f.clientWidth, Hd = f.clientHeight;
      if (!Wd || !Hd) return;
      var rad = Math.max(40, Math.min(72, Hd * .22)), cx = Wd / 2, cy = Hd / 2, m = 12;
      R.dots.forEach(function (dot, n) {
        var p = PTS[n], t = TEAM.indexOf(n);
        var x0 = m + p[0] * (Wd - 2 * m), y0 = m + p[1] * (Hd - 2 * m);
        var x1 = t > -1 ? cx + rad * Math.cos(ANG[t]) : x0, y1 = t > -1 ? cy + rad * Math.sin(ANG[t]) : y0;
        dot.style.setProperty('--x0', x0.toFixed(1) + 'px'); dot.style.setProperty('--y0', y0.toFixed(1) + 'px');
        dot.style.setProperty('--x1', x1.toFixed(1) + 'px'); dot.style.setProperty('--y1', y1.toFixed(1) + 'px');
      });
      var size = rad * 10 / 3;
      R.ring.style.cssText = 'left:' + (cx - size / 2) + 'px;top:' + (cy - size / 2) + 'px;width:' + size + 'px;height:' + size + 'px';
    }
    function onResize() { clearTimeout(rt); rt = setTimeout(layout, 150); }
    function later(ms, fn) { timers.push(setTimeout(function () { if (alive) fn(); }, ms)); }
    function count(groups, from, to, ms, ease, done) {
      var t0 = 0;
      (function f(now) {
        if (!alive) return;
        if (!t0) t0 = now;
        var p = Math.min(1, (now - t0) / ms);
        setClock(groups, from + (to - from) * ease(p));
        if (p < 1) requestAnimationFrame(f); else if (done) done();
      })(performance.now());
    }
    var out3 = function (p) { return 1 - Math.pow(1 - p, 3); };
    var out4 = function (p) { return 1 - Math.pow(1 - p, 4); };

    function play(t) {
      if (t.classList.contains('is-in')) return;
      t.classList.add('is-in');
      if (rm) {
        if (t === R.t2) { setClock(R.dg.m2, H50); R.field.classList.add('is-team'); }
        if (t === R.t3) setClock(R.dg.m3, H24);
        if (t === R.t4) { setClock(R.dg.m4, 0); t.classList.add('is-zero'); }
        return;
      }
      if (t === R.t2) {
        later(300, function () { count(R.dg.m2, H54, H50, 1500, out3); });
        later(1150, function () { R.field.classList.add('is-team'); });
      }
      if (t === R.t3) later(300, function () { count(R.dg.m3, H50, H24, 1700, out3); });
      if (t === R.t4) later(400, function () { count(R.dg.m4, H24, 0, 2600, out4, function () { R.t4.classList.add('is-zero'); }); });
    }

    resetMinis(R);
    layout();
    W.addEventListener('resize', onResize);
    if ('IntersectionObserver' in W) {
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { play(e.target); io.unobserve(e.target); } });
      }, { threshold: .3 });
      R.ts.forEach(function (t) { io.observe(t); });
    } else {
      R.ts.forEach(play);
    }

    return function () {
      alive = false;
      timers.forEach(clearTimeout); clearTimeout(rt);
      if (io) io.disconnect();
      W.removeEventListener('resize', onResize);
      sec.classList.remove('is-flow', 'is-rm');
      R.ts.forEach(function (t) { t.classList.remove('is-in', 'is-zero'); });
      R.field.classList.remove('is-team');
      R.ring.style.cssText = '';
      resetMinis(R);
    };
  }

  /* =========================================================
     Mode épinglé : la section reste à l'écran, le défilement joue le week-end
     ========================================================= */
  function pin(R, G, ST) {
    var sec = R.sec, st = R.stage, geo = {};
    sec.classList.add('is-pin');

    function measure() {
      var Wd = st.clientWidth, Hd = st.clientHeight;
      var pb = box(R.print, st), cx = pb.x + pb.w / 2, cy = pb.y + pb.h / 2;
      var rad = Math.max(52, Math.min(96, Wd * .058));
      geo.sc = PTS.map(function (p) { return { x: Wd * (.42 + p[0] * .54), y: Hd * (.15 + p[1] * .72) }; });
      geo.ring = ANG.map(function (a) { return { x: cx + rad * Math.cos(a), y: cy + rad * Math.sin(a) }; });
      var A = PRINT_ROT * Math.PI / 180, c = Math.cos(A), s = Math.sin(A);
      geo.face = R.fps.map(function (m) {
        var b = box(m, st), dx = b.x - cx, dy = b.y - cy;
        return { x: cx + dx * c - dy * s, y: cy + dx * s + dy * c };
      });
      var cb = box(R.clock, st), mb = box(R.mini2, st);
      geo.dock = { x: mb.x + mb.w / 2 - (cb.x + cb.w / 2), y: mb.y + mb.h / 2 - (cb.y + cb.h / 2), s: mb.h / cb.h };
      var size = rad * 10 / 3;
      R.ring.style.cssText = 'left:' + (cx - size / 2) + 'px;top:' + (cy - size / 2) + 'px;width:' + size + 'px;height:' + size + 'px';
      var p = R.probe, rr = parseFloat(getComputedStyle(p).borderTopLeftRadius) || 28;
      geo.clip = 'inset(' + p.offsetTop + 'px ' + (Wd - p.offsetLeft - p.offsetWidth) + 'px ' +
        (Hd - p.offsetTop - p.offsetHeight) + 'px ' + p.offsetLeft + 'px round ' + rr + 'px)';
      geo.k = Math.max(1.6, Math.min(2.6, Wd / 620));
    }
    measure();
    ST.addEventListener('refreshInit', measure);

    var clk = { s: H54 };
    function render() { setClock(R.dg.clock, clk.s); }
    var OUT = 'power2.out', IO = 'power3.inOut', AWAY = 'power2.in';
    var blurIn = function (els, at, stg) {
      tl.fromTo(els, { opacity: 0, y: 22, filter: 'blur(12px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: .5, stagger: stg || .07, ease: OUT }, at);
    };
    var fadeUp = function (el, at) { tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .45, ease: OUT }, at); };
    var leave = function (els, at) { tl.to(els, { opacity: 0, y: -14, duration: .22, ease: AWAY }, at); };

    var tl = G.timeline({
      defaults: { ease: 'none' },
      onUpdate: render,
      scrollTrigger: { trigger: sec, start: 'top top', end: '+=470%', pin: true, scrub: .8, anticipatePin: 1, invalidateOnRefresh: true, onRefresh: function () { render(); } }
    });

    /* 1. 54:00:00 : les chiffres montent d'une fente pendant que la section arrive
       (avant l'épinglage, pour qu'aucun écran ne reste vide), puis restent un temps */
    G.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: sec, start: 'top 80%', end: 'top 8%', scrub: .8 } })
      .fromTo(R.dg.clock[0], { yPercent: 110 }, { yPercent: 0, duration: .55, stagger: .05, ease: 'power3.out' }, 0)
      .fromTo(R.seps, { opacity: 0 }, { opacity: .5, duration: .4, ease: OUT }, .15)
      .fromTo(R.cap, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .4, ease: OUT }, .5);

    /* 2. Vendredi soir : le compteur se range et file ; une équipe se forme */
    tl.fromTo(R.cap, { opacity: 1, y: 0 }, { opacity: 0, y: -14, duration: .22, ease: AWAY, immediateRender: false }, 1.35);
    tl.fromTo(R.clock, { x: 0, y: 0, scale: 1, opacity: 1 },
      { x: function () { return geo.dock.x; }, y: function () { return geo.dock.y; }, scale: function () { return geo.dock.s; },
        opacity: .72, duration: .7, ease: IO }, 1.55);
    tl.fromTo(clk, { s: H54 }, { s: H50, duration: 2.25 }, 1.75);
    blurIn(R.day[2].w, 1.85);
    fadeUp(R.day[2].line, 2.1);
    R.dots.forEach(function (dot, n) {
      var t = TEAM.indexOf(n);
      tl.fromTo(dot, { x: function () { return geo.sc[n].x; }, y: function () { return geo.sc[n].y; }, opacity: 0, scale: .3 },
        { opacity: .36, scale: 1, duration: .5, ease: OUT }, 1.6 + DL[n] * .45);
      if (t < 0) {
        tl.to(dot, { opacity: .1, duration: .6 }, 2.6).to(dot, { opacity: 0, duration: .25 }, 4.1);
        return;
      }
      tl.to(dot, { x: function () { return geo.ring[t].x; }, y: function () { return geo.ring[t].y; }, opacity: 1, duration: .8, ease: IO }, 2.55 + t * .03)
        .fromTo(dot.firstChild, { opacity: 0 }, { opacity: 1, duration: .4 }, 2.6)
        /* 3. … et rejoint les six visages du tirage */
        .to(dot, { x: function () { return geo.face[t].x; }, y: function () { return geo.face[t].y; }, duration: .85, ease: IO }, 4.15)
        .to(dot, { opacity: 0, scale: 2.4, duration: .32, ease: 'power1.out' }, 4.9);
    });
    tl.fromTo(R.ringPath, { strokeDashoffset: 1, opacity: .75 }, { strokeDashoffset: 0, duration: .5, ease: OUT }, 3.25)
      .to(R.ringPath, { opacity: 0, duration: .2 }, 4.1);

    /* 3. Samedi : on construit */
    leave(R.day[2].w.concat(R.day[2].line), 4.1);
    tl.fromTo(R.print, { opacity: 0, y: 90, scale: .965, rotation: -7 },
      { opacity: 1, y: 0, scale: 1, rotation: PRINT_ROT, duration: .85, ease: 'power3.out' }, 4.15);
    blurIn(R.day[3].w, 4.4);
    fadeUp(R.day[3].line, 4.62);
    tl.fromTo(R.traits, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .45, stagger: .22, ease: 'power2.inOut' }, 5.0);
    tl.to(clk, { s: H24, duration: 2.7 }, 4.1);

    /* 4. Dimanche : la lumière baisse, le compteur revient et ralentit */
    leave(R.day[3].w.concat(R.day[3].line), 6.9);
    tl.to(R.print, { opacity: 0, y: -40, duration: .3, ease: AWAY }, 6.9)
      .fromTo(R.night, { opacity: 0 }, { opacity: 1, duration: .7, ease: 'power1.inOut' }, 6.95)
      .to(R.glow, { opacity: 0, duration: .6 }, 6.95)
      .to(R.clock, { x: 0, y: 0, scale: .8, opacity: 1, duration: .8, ease: IO }, 6.95)
      .to(R.faceInk, { opacity: 0, duration: .5 }, 7.1)
      .fromTo(R.faceLux, { opacity: 0 }, { opacity: 1, duration: .5 }, 7.1)
      .to(clk, { s: 0, duration: 2.0, ease: 'power4.out' }, 6.95);
    blurIn(R.day[4].w, 7.4);
    fadeUp(R.day[4].line, 7.62);

    /* 5. 00:00:00 : l'éclat, l'iris s'ouvre sur l'annonce */
    tl.fromTo(R.flash, { opacity: 0, scale: .2 }, { opacity: 1, scale: 1, duration: .2, ease: OUT }, 9.3)
      .to(R.flash, { opacity: 0, scale: 1.5, duration: .7, ease: 'power1.out' }, 9.5)
      .fromTo(R.clock, { filter: 'blur(0px)' }, { filter: 'blur(14px)', opacity: 0, scale: .92, duration: .28, ease: AWAY }, 9.32)
      .to(R.day[4].w.concat(R.day[4].line), { opacity: 0, duration: .2, ease: AWAY }, 9.32);
    R.sparks.forEach(function (s, n) {
      tl.fromTo(s, { x: 0, y: 0, scale: 1 },
        { x: function () { return SP[n][0] * geo.k; }, y: function () { return SP[n][1] * geo.k; }, scale: .3, duration: .95, ease: 'power3.out' }, 9.33)
        .fromTo(s, { opacity: 0 }, { opacity: 1, duration: .12 }, 9.33)
        .to(s, { opacity: 0, duration: .5 }, 9.72);
    });
    tl.fromTo(R.iris, { clipPath: 'circle(0% at 53% 41%)' }, { clipPath: 'circle(80% at 53% 41%)', duration: .9, ease: 'power2.inOut' }, 9.4)
      .fromTo(R.pglow, { opacity: 0 }, { opacity: .6, duration: .35, ease: OUT }, 9.45)
      .to(R.pglow, { opacity: .08, duration: .8 }, 9.85)
      .set(R.night, { opacity: 0 }, 10.4);
    tl.fromTo(R.tw, { opacity: 0, y: 36, filter: 'blur(16px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: .6, stagger: .12, ease: OUT }, 9.95);
    tl.fromTo(R.credit, { opacity: 0 }, { opacity: 1, duration: .4 }, 10.35)
      .fromTo(R.cheque, { opacity: 0, y: 140, rotation: 9, scale: .965 },
        { opacity: 1, y: 0, rotation: CHEQUE_ROT, scale: 1, duration: .75, ease: 'power3.out' }, 10.55);

    /* 6. La photo se range en cadre, la ligne de fin */
    tl.fromTo(R.photo, { clipPath: 'inset(0px 0px 0px 0px round 0px)' },
      { clipPath: function () { return geo.clip; }, duration: .7, ease: IO }, 11.5);
    fadeUp(R.end, 11.95);
    tl.to({}, { duration: .9 }, 12.0);

    render();
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(function () { if (sec.classList.contains('is-pin')) ST.refresh(); });

    return function () {
      ST.removeEventListener('refreshInit', measure);
      sec.classList.remove('is-pin');
      R.ring.style.cssText = '';
      clk.s = H54; render();
    };
  }

  /* ---------- Démarrage ---------- */
  function init(sec) {
    if (!sec) return null;
    if (sec.__kv) return sec.__kv;
    var R = build(sec);
    sec.__kv = R;
    var G = W.gsap, ST = W.ScrollTrigger;
    if (G && ST && typeof G.matchMedia === 'function') {
      G.registerPlugin(ST);
      R.mm = G.matchMedia();
      R.mm.add({ pin: PIN_Q, all: '(min-width: 0px)' }, function (ctx) {
        return ctx.conditions.pin ? pin(R, G, ST) : flow(R);
      });
    } else {
      R.stop = flow(R);
    }
    sec.dispatchEvent(new CustomEvent('victoire:pret', { bubbles: true }));
    return R;
  }
  function boot() { Array.prototype.forEach.call(D.querySelectorAll('[data-kz-victoire]'), init); }

  W.KzVictoire = {
    init: init,
    refresh: function () { if (W.ScrollTrigger) W.ScrollTrigger.refresh(); }
  };
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
