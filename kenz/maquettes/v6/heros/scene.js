(() => {
  'use strict';
  const root = document.documentElement;
  const params = new URLSearchParams(location.search);
  const directions = {
    horizon: { number: '01', name: 'Horizon', pro: 'La nuit s’ouvre sur les idées.', createur: 'Le jour s’ouvre sur le monde.', zoom: .075 },
    passage: { number: '02', name: 'Passage', pro: 'Donner une forme à ce qui vient.', createur: 'De l’autre côté, tout commence.', zoom: .12 },
    atlas: { number: '03', name: 'Atlas', pro: 'Dessiner ce qui n’existe pas encore.', createur: 'Suivre les lignes du monde.', zoom: .06 }
  };
  let direction = Object.hasOwn(directions, params.get('direction')) ? params.get('direction') : 'horizon';
  let mode = params.get('mode') === 'createur' ? 'createur' : 'pro';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  let motion = !reduced.matches;
  const $ = (selector) => document.querySelector(selector);
  const hero = $('.hero');
  const portrait = $('.portrait-stage');
  const copy = $('.hero-copy');
  const lands = [...document.querySelectorAll('.landscape')];
  const haze = [...document.querySelectorAll('.atmosphere')];
  const foreground = $('.foreground');
  let targetX = 0, targetY = 0, x = 0, y = 0, frame = 0;
  let preloadToken = 0;
  if (params.has('capture')) root.classList.add('capture');

  function renderState(writeURL = true) {
    root.dataset.mode = mode;
    root.dataset.direction = direction;
    const d = directions[direction];
    $('#direction-name').textContent = d.name;
    $('#direction-number').textContent = d.number;
    $('#scene-caption').textContent = d[mode];
    const pro = mode === 'pro';
    $('#hero-eyebrow').textContent = pro ? 'De l’idée à la réalité' : 'Le monde pour terrain de jeu';
    $('#hero-line').innerHTML = pro ? 'Je construis des apps<br>où l’IA fait le <em>vrai</em> travail.' : 'Je voyage, je m’entraîne,<br>je te raconte tout.<br><em>Vraiment.</em>';
    $('#next-label').textContent = pro ? 'Voir ce que je construis' : 'Partir avec moi';
    $('#header-link').href = pro ? '../pro.html#contact' : '../createur.html#suivre';
    $('#header-link span').textContent = pro ? 'Me contacter' : 'Me suivre';
    $('#suite-eyebrow').textContent = pro ? 'Des idées devenues réelles' : 'Des endroits, des rencontres, des histoires';
    $('#suite-title').innerHTML = pro ? 'Mes apps<span>.</span>' : 'Le monde, en vrai<span>.</span>';
    $('#suite-line').innerHTML = pro ? 'Je les imagine, je les code, je les <em>publie.</em>' : 'L’Asie, les détours et tout ce qu’on ne voit pas <em>sur une carte.</em>';
    $('#apps').hidden = !pro;
    $('#travel').hidden = pro;
    document.querySelectorAll('button[data-direction]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.direction === direction)));
    document.querySelectorAll('button[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    document.title = `Kenz — ${d.name} · ${pro ? 'Pro' : 'Créateur'}`;
    $('#status').textContent = `${d.name}, univers ${pro ? 'professionnel' : 'créateur'}`;
    if (writeURL) {
      const url = new URL(location.href);
      url.searchParams.set('direction', direction);
      url.searchParams.set('mode', mode);
      history.replaceState(null, '', url);
    }
    schedule();
  }

  async function loadDirection(next) {
    if (!Object.hasOwn(directions, next)) return;
    const token = ++preloadToken;
    const paths = ['pro', 'createur'].map(m => `assets/${next}-${m}.png`);
    await Promise.all(paths.map(src => new Promise(resolve => {
      const image = new Image(); image.onload = resolve; image.onerror = resolve; image.src = src;
    })));
    if (token !== preloadToken) return;
    direction = next;
    lands.forEach((img, i) => { img.src = paths[i]; });
    renderState();
  }

  function updateMotionButton() {
    $('#motion-toggle').setAttribute('aria-pressed', String(motion));
    $('#motion-toggle').setAttribute('aria-label', `${motion ? 'Désactiver' : 'Activer'} le parallaxe`);
    $('#motion-toggle').title = `${motion ? 'Désactiver' : 'Activer'} le parallaxe`;
  }

  function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
  function draw() {
    frame = 0;
    const active = motion && !reduced.matches;
    const travel = Math.min(scrollY, innerHeight * 1.5);
    const progress = Math.min(travel / (innerHeight * .9), 1);
    x += ((active ? targetX : 0) - x) * .085;
    y += ((active ? targetY : 0) - y) * .085;
    const distance = active ? Math.min(travel, innerHeight * .8) : 0;
    const zoom = active ? 1 + progress * directions[direction].zoom : 1;
    lands.forEach(el => { el.style.transform = `translate3d(${x * -11}px,${distance * -.07 + y * -7}px,0) scale(${zoom})`; });
    haze.forEach(el => { el.style.transform = `translate3d(${x * -27}px,${distance * -.15 + y * -14}px,0)`; });
    portrait.style.transform = `translate3d(${x * 13}px,${distance * -.24 + y * 7}px,0) scale(${1 + (active ? progress * .045 : 0)})`;
    foreground.style.transform = `translate3d(${x * 22}px,${distance * -.39}px,0)`;
    copy.style.transform = `translate3d(0,${distance * -.12}px,0)`;
    copy.style.opacity = String(active ? Math.max(.15, 1 - progress * .65) : 1);
    $('.scroll-track span').style.transform = `scaleY(${.05 + progress * .95})`;
    if (active && (Math.abs(targetX - x) > .002 || Math.abs(targetY - y) > .002)) schedule();
  }

  hero.addEventListener('pointermove', e => {
    if (!finePointer.matches || !motion || reduced.matches) return;
    const rect = hero.getBoundingClientRect();
    targetX = (e.clientX - rect.left) / rect.width - .5;
    targetY = (e.clientY - rect.top) / rect.height - .5;
    schedule();
  });
  hero.addEventListener('pointerleave', () => { targetX = targetY = 0; schedule(); });
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  document.querySelectorAll('button[data-direction]').forEach(b => b.addEventListener('click', () => loadDirection(b.dataset.direction)));
  document.querySelectorAll('button[data-mode]').forEach(b => b.addEventListener('click', () => { mode = b.dataset.mode; renderState(); }));
  $('#motion-toggle').addEventListener('click', () => { motion = !motion; updateMotionButton(); schedule(); });
  reduced.addEventListener('change', () => { motion = !reduced.matches; updateMotionButton(); schedule(); });
  updateMotionButton();
  lands.forEach((img, i) => { img.src = `assets/${direction}-${i ? 'createur' : 'pro'}.png`; });
  renderState(false);
})();
