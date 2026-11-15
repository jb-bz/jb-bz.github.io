/* MysteryD atmosphere: a living case file. Vanilla JS, no deps.
   - drifting original-glyph sigil field on a fixed canvas (subtle, viridian ink)
   - pointer lamp that warms the paper where the cursor rests
   - folio parallax on scroll, one rAF loop, paused off-tab
   - typewriter reveal of the status line
   Everything honors prefers-reduced-motion and degrades to static. */
(function () {
  'use strict';

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(pointer: fine)');

  /* ---------- typewriter status line ---------- */
  function typewrite() {
    var el = document.querySelector('.status-typed');
    if (!el || reduceMq.matches) return;
    var full = el.textContent;
    el.textContent = '';
    el.classList.add('typing');
    var i = 0;
    var timer = setInterval(function () {
      i += 1;
      el.textContent = full.slice(0, i);
      if (i >= full.length) { clearInterval(timer); el.classList.remove('typing'); }
    }, 55);
  }

  /* ---------- sigil field ----------
     Original MysteryD glyph library: 16 stroke-path sigils drawn from the
     public-domain Mythos entity descriptions (docs/sigil-briefs.md).
     No third-party artwork. Each sigil gets a random glyph AND random
     motion; the glyph re-rolls whenever the sigil wraps an edge. */
  var canvas = document.getElementById('sigil-field');
  var lamp = document.getElementById('lamp');
  var ctx = canvas ? canvas.getContext('2d') : null;
  var sigils = [];
  var raf = null;
  var running = false;
  var W = 0, H = 0, DPR = 1;

  /* helpers: unit-space drawing, scaled to the sigil radius */
  function line(c, x1, y1, x2, y2) {
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  }
  function ring(c, r, a0, a1) {
    c.beginPath(); c.arc(0, 0, r, a0 === undefined ? 0 : a0, a1 === undefined ? Math.PI * 2 : a1); c.stroke();
  }
  function poly(c, pts, close) {
    c.beginPath();
    for (var i = 0; i < pts.length; i++) {
      if (i === 0) c.moveTo(pts[i][0], pts[i][1]); else c.lineTo(pts[i][0], pts[i][1]);
    }
    if (close) c.closePath();
    c.stroke();
  }
  function starPts(n, r, step) {
    var pts = [];
    for (var k = 0; k <= n; k++) {
      var a = -Math.PI / 2 + (k * (step || 2) * 2 * Math.PI) / n;
      pts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
    return pts;
  }
  function dot(c, x, y, r) {
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = c.strokeStyle; c.fill();
  }
  function eye(c, x, y, w, h) {
    c.beginPath(); c.ellipse(x, y, w, h, 0, 0, Math.PI * 2); c.stroke();
    dot(c, x, y, h * 0.38);
  }

  /* 1 · Elder Sign — warding star in a broken ring, watchful eye */
  function g_eldersign(c, r) {
    ring(c, r, 0.35, Math.PI * 2 - 0.35);
    poly(c, starPts(5, r * 0.78, 2), false);
    eye(c, 0, 0, r * 0.22, r * 0.13);
  }
  /* 2 · Yig — father of serpents: coiled spiral, forked tongue */
  function g_yig(c, r) {
    c.beginPath();
    for (var a = 0; a <= Math.PI * 4.6; a += 0.12) {
      var rr = r * 0.08 + (a / (Math.PI * 4.6)) * r * 0.72;
      var x = Math.cos(a) * rr, y = Math.sin(a) * rr;
      if (a === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.stroke();
    var ex = Math.cos(Math.PI * 4.6) * r * 0.8, ey = Math.sin(Math.PI * 4.6) * r * 0.8;
    line(c, ex, ey, ex + r * 0.22, ey - r * 0.1);
    line(c, ex + r * 0.22, ey - r * 0.1, ex + r * 0.34, ey - r * 0.2);
    line(c, ex + r * 0.22, ey - r * 0.1, ex + r * 0.36, ey - r * 0.02);
    dot(c, 0, 0, r * 0.06);
  }
  /* 3 · Yellow Sign — tattered banner on a crooked pole, three tails */
  function g_yellowsign(c, r) {
    line(c, -r * 0.15, -r * 0.95, r * 0.05, r * 0.95);
    poly(c, [[-r * 0.12, -r * 0.8], [r * 0.75, -r * 0.62], [r * 0.55, -r * 0.1],
             [r * 0.78, r * 0.12], [r * 0.3, r * 0.05], [r * 0.42, r * 0.45],
             [r * 0.02, r * 0.28]], false);
    line(c, -r * 0.12, -r * 0.8, -r * 0.02, r * 0.28);
  }
  /* 4 · Cthulhu — sunken idol: domed head, tentacle beard, wing arcs */
  function g_cthulhu(c, r) {
    c.beginPath(); c.arc(0, -r * 0.3, r * 0.42, Math.PI, 0); c.stroke();
    eye(c, -r * 0.16, -r * 0.34, r * 0.09, r * 0.06);
    eye(c, r * 0.16, -r * 0.34, r * 0.09, r * 0.06);
    for (var i = -2; i <= 2; i++) {
      c.beginPath();
      c.moveTo(i * r * 0.14, r * 0.05);
      c.quadraticCurveTo(i * r * 0.2, r * 0.45, i * r * 0.3, r * 0.8);
      c.stroke();
    }
    c.beginPath(); c.arc(-r * 0.75, -r * 0.1, r * 0.5, -Math.PI * 0.45, Math.PI * 0.3); c.stroke();
    c.beginPath(); c.arc(r * 0.75, -r * 0.1, r * 0.5, Math.PI * 0.7, Math.PI * 1.45); c.stroke();
  }
  /* 5 · Dagon — deep-one trident rising through a wave line */
  function g_dagon(c, r) {
    line(c, 0, -r * 0.9, 0, r * 0.7);
    line(c, -r * 0.4, -r * 0.55, -r * 0.4, -r * 0.15);
    line(c, r * 0.4, -r * 0.55, r * 0.4, -r * 0.15);
    c.beginPath(); c.arc(0, -r * 0.15, r * 0.4, 0, Math.PI); c.stroke();
    poly(c, [[-r * 0.14, -r * 0.72], [0, -r * 0.95], [r * 0.14, -r * 0.72]], false);
    c.beginPath();
    c.moveTo(-r * 0.9, r * 0.55);
    c.quadraticCurveTo(-r * 0.45, r * 0.3, 0, r * 0.55);
    c.quadraticCurveTo(r * 0.45, r * 0.8, r * 0.9, r * 0.55);
    c.stroke();
  }
  /* 6 · Ghatanothoa — petrifying gaze: nested eyes in a triangle */
  function g_ghatanothoa(c, r) {
    poly(c, starPts(3, r * 0.95, 1), true);
    eye(c, 0, r * 0.12, r * 0.42, r * 0.24);
    eye(c, 0, r * 0.12, r * 0.18, r * 0.1);
    line(c, 0, -r * 0.55, 0, -r * 0.25);
  }
  /* 7 · Gloon — the shell temple: spiral shell with a sealed door */
  function g_gloon(c, r) {
    c.beginPath();
    for (var a = 0; a <= Math.PI * 3.4; a += 0.12) {
      var rr = r * 0.12 + (a / (Math.PI * 3.4)) * r * 0.78;
      var x = Math.cos(a + 2.2) * rr, y = Math.sin(a + 2.2) * rr;
      if (a === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.stroke();
    poly(c, [[-r * 0.14, r * 0.3], [-r * 0.14, r * 0.72], [r * 0.14, r * 0.72], [r * 0.14, r * 0.3]], false);
    c.beginPath(); c.arc(0, r * 0.3, r * 0.14, Math.PI, 0); c.stroke();
  }
  /* 8 · Hastur — the King in Yellow: tattered crown over a masked void */
  function g_hastur(c, r) {
    poly(c, [[-r * 0.6, -r * 0.2], [-r * 0.45, -r * 0.75], [-r * 0.2, -r * 0.35],
             [0, -r * 0.9], [r * 0.2, -r * 0.35], [r * 0.45, -r * 0.75], [r * 0.6, -r * 0.2]], false);
    line(c, -r * 0.6, -r * 0.2, r * 0.6, -r * 0.2);
    c.beginPath(); c.ellipse(0, r * 0.3, r * 0.34, r * 0.45, 0, 0, Math.PI * 2); c.stroke();
    line(c, -r * 0.12, r * 0.22, r * 0.12, r * 0.22);
  }
  /* 9 · Nyarlathotep — the crawling chaos: tall obelisk, three faces */
  function g_nyarlathotep(c, r) {
    poly(c, [[-r * 0.22, r * 0.9], [-r * 0.12, -r * 0.7], [0, -r * 0.95],
             [r * 0.12, -r * 0.7], [r * 0.22, r * 0.9]], false);
    eye(c, 0, -r * 0.45, r * 0.08, r * 0.05);
    eye(c, 0, -r * 0.05, r * 0.08, r * 0.05);
    eye(c, 0, r * 0.35, r * 0.08, r * 0.05);
    line(c, -r * 0.55, r * 0.9, r * 0.55, r * 0.9);
  }
  /* 10 · Rhan-Tegoth — three-lobed idol on a pedestal, six limbs */
  function g_rhantegoth(c, r) {
    ring(c, r * 0.2, 0, Math.PI * 2);
    c.beginPath(); c.arc(-r * 0.32, -r * 0.18, r * 0.2, 0, Math.PI * 2); c.stroke();
    c.beginPath(); c.arc(r * 0.32, -r * 0.18, r * 0.2, 0, Math.PI * 2); c.stroke();
    for (var i = -1; i <= 1; i++) {
      line(c, i * r * 0.3, r * 0.1, i * r * 0.55, r * 0.6);
    }
    line(c, -r * 0.6, r * 0.75, r * 0.6, r * 0.75);
    dot(c, 0, 0, r * 0.05);
  }
  /* 11 · Tsathoggua — the toad-god: squat dome, sleepy eyes, wide mouth */
  function g_tsathoggua(c, r) {
    c.beginPath(); c.ellipse(0, r * 0.1, r * 0.75, r * 0.6, 0, Math.PI, 0); c.stroke();
    line(c, -r * 0.75, r * 0.1, r * 0.75, r * 0.1);
    c.beginPath(); c.arc(-r * 0.3, -r * 0.18, r * 0.12, Math.PI * 0.15, Math.PI * 0.85); c.stroke();
    c.beginPath(); c.arc(r * 0.3, -r * 0.18, r * 0.12, Math.PI * 0.15, Math.PI * 0.85); c.stroke();
    c.beginPath(); c.arc(0, r * 0.28, r * 0.4, Math.PI * 0.15, Math.PI * 0.85); c.stroke();
    dot(c, -r * 0.55, r * 0.55, r * 0.07);
    dot(c, r * 0.55, r * 0.55, r * 0.07);
  }
  /* 12 · Ygolonac — the defiler: headless torso, mouths in both palms */
  function g_ygolonac(c, r) {
    line(c, -r * 0.3, -r * 0.55, r * 0.3, -r * 0.55);
    poly(c, [[-r * 0.3, -r * 0.55], [-r * 0.45, r * 0.35], [r * 0.45, r * 0.35], [r * 0.3, -r * 0.55]], false);
    line(c, -r * 0.3, -r * 0.45, -r * 0.8, -r * 0.1);
    line(c, r * 0.3, -r * 0.45, r * 0.8, -r * 0.1);
    eye(c, -r * 0.8, r * 0.05, r * 0.14, r * 0.09);
    eye(c, r * 0.8, r * 0.05, r * 0.14, r * 0.09);
    line(c, -r * 0.2, r * 0.35, -r * 0.25, r * 0.85);
    line(c, r * 0.2, r * 0.35, r * 0.25, r * 0.85);
  }
  /* 13 · Yog-Sothoth — the gate: interlocked spheres, keyhole at center */
  function g_yogsothoth(c, r) {
    ring(c, r * 0.55, 0, Math.PI * 2);
    c.beginPath(); c.arc(-r * 0.4, -r * 0.3, r * 0.34, 0, Math.PI * 2); c.stroke();
    c.beginPath(); c.arc(r * 0.42, -r * 0.25, r * 0.3, 0, Math.PI * 2); c.stroke();
    c.beginPath(); c.arc(0, r * 0.45, r * 0.32, 0, Math.PI * 2); c.stroke();
    ring(c, r * 0.12, 0, Math.PI * 2);
    poly(c, [[-r * 0.06, r * 0.1], [-r * 0.1, r * 0.3], [r * 0.1, r * 0.3], [r * 0.06, r * 0.1]], true);
  }
  /* 14 · Azathoth — the blind idiot god: chaotic orbit, piping flutes */
  function g_azathoth(c, r) {
    ring(c, r * 0.9, 0.6, Math.PI * 1.7);
    ring(c, r * 0.62, Math.PI * 0.9, Math.PI * 2.4);
    c.beginPath();
    c.moveTo(-r * 0.3, r * 0.1);
    c.bezierCurveTo(-r * 0.1, -r * 0.4, r * 0.2, r * 0.4, r * 0.35, -r * 0.1);
    c.stroke();
    dot(c, 0, 0, r * 0.08);
    line(c, -r * 0.5, r * 0.5, -r * 0.2, r * 0.7);
    line(c, r * 0.25, -r * 0.6, r * 0.5, -r * 0.45);
  }
  /* 15 · Nodens — lord of the abyss: silver hand, hunting horn, sea */
  function g_nodens(c, r) {
    c.beginPath(); c.arc(0, -r * 0.25, r * 0.3, Math.PI * 0.9, Math.PI * 2.1); c.stroke();
    for (var i = -2; i <= 2; i++) {
      line(c, i * r * 0.13, -r * 0.5, i * r * 0.17, -r * 0.85);
    }
    c.beginPath();
    c.moveTo(-r * 0.85, r * 0.45);
    c.quadraticCurveTo(-r * 0.4, r * 0.2, 0, r * 0.45);
    c.quadraticCurveTo(r * 0.4, r * 0.7, r * 0.85, r * 0.45);
    c.stroke();
    dot(c, 0, -r * 0.2, r * 0.05);
  }
  /* 16 · Atlach-Nacha — the spider god: web bridge across the void */
  function g_atlachnacha(c, r) {
    ring(c, r * 0.95, 0, Math.PI * 2);
    for (var k = 0; k < 6; k++) {
      var a = (k * Math.PI) / 3;
      line(c, Math.cos(a) * r * 0.2, Math.sin(a) * r * 0.2, Math.cos(a) * r * 0.95, Math.sin(a) * r * 0.95);
    }
    ring(c, r * 0.5, 0.3, Math.PI * 1.8);
    c.beginPath(); c.ellipse(0, 0, r * 0.16, r * 0.22, 0, 0, Math.PI * 2); c.stroke();
    dot(c, 0, -r * 0.05, r * 0.04);
  }

  var GLYPHS = [g_eldersign, g_yig, g_yellowsign, g_cthulhu, g_dagon,
    g_ghatanothoa, g_gloon, g_hastur, g_nyarlathotep, g_rhantegoth,
    g_tsathoggua, g_ygolonac, g_yogsothoth, g_azathoth, g_nodens, g_atlachnacha];

  function drawSigil(c, s, t) {
    var wob = Math.sin(t * s.wobSpeed + s.phase) * s.wobAmp;
    var rot = s.rot + t * s.spin + wob;
    var breathe = 1 + Math.sin(t * s.breathSpeed + s.phase) * s.breathAmp;
    var r = s.r * breathe;
    c.save();
    c.translate(s.x, s.y);
    c.rotate(rot);
    c.globalAlpha = s.alpha * (0.75 + 0.25 * Math.sin(t * s.pulseSpeed + s.phase));
    c.strokeStyle = s.color;
    c.lineWidth = s.lw;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    GLYPHS[s.glyph](c, r);
    c.restore();
  }

  function rollMotion(s) {
    var ang = Math.random() * Math.PI * 2;
    var speed = 2 + Math.random() * 7;
    s.vx = Math.cos(ang) * speed;
    s.vy = Math.sin(ang) * speed;
    s.spin = (Math.random() - 0.5) * 0.16;
    s.wobSpeed = 0.2 + Math.random() * 0.7;
    s.wobAmp = 0.03 + Math.random() * 0.1;
    s.breathSpeed = 0.2 + Math.random() * 0.5;
    s.breathAmp = 0.02 + Math.random() * 0.06;
    s.pulseSpeed = 0.15 + Math.random() * 0.4;
    s.phase = Math.random() * Math.PI * 2;
  }

  function seed() {
    sigils = [];
    var count = Math.max(5, Math.min(11, Math.round((W * H) / 160000)));
    var palette = ['rgba(30,110,90,', 'rgba(87,80,63,', 'rgba(146,116,70,'];
    for (var i = 0; i < count; i++) {
      var s = {
        x: Math.random() * W,
        y: Math.random() * H,
        r: 26 + Math.random() * 60,
        rot: Math.random() * Math.PI * 2,
        glyph: Math.floor(Math.random() * GLYPHS.length),
        alpha: 0.05 + Math.random() * 0.07,
        lw: 1 + Math.random() * 0.8,
        color: palette[i % palette.length]
      };
      rollMotion(s);
      sigils.push(s);
    }
  }

  function resize() {
    if (!canvas) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seed();
  }

  var last = 0;
  function frame(now) {
    if (!running) return;
    var t = now / 1000;
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < sigils.length; i++) {
      var s = sigils[i];
      s.x += s.vx * dt; s.y += s.vy * dt;
      var m = s.r * 2;
      if (s.y < -m) { s.y = H + m; s.x = Math.random() * W; s.glyph = Math.floor(Math.random() * GLYPHS.length); rollMotion(s); }
      if (s.y > H + m) { s.y = -m; s.x = Math.random() * W; s.glyph = Math.floor(Math.random() * GLYPHS.length); rollMotion(s); }
      if (s.x < -m) { s.x = W + m; s.glyph = Math.floor(Math.random() * GLYPHS.length); rollMotion(s); }
      if (s.x > W + m) { s.x = -m; s.glyph = Math.floor(Math.random() * GLYPHS.length); rollMotion(s); }
      drawSigil(ctx, s, t);
    }
    parallax();
    raf = window.requestAnimationFrame(frame);
  }

  /* ---------- folio parallax ---------- */
  var folios = Array.prototype.slice.call(document.querySelectorAll('.folio'));
  function parallax() {
    for (var i = 0; i < folios.length; i++) {
      var f = folios[i];
      var rect = f.parentElement.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > H + 100) continue;
      var p = (rect.top + rect.height / 2 - H / 2) / H;
      f.style.transform = 'translateY(' + (p * -34).toFixed(1) + 'px)';
    }
  }

  function paintStatic() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < sigils.length; i++) drawSigil(ctx, sigils[i], 0);
  }

  function start() {
    if (!ctx) return;
    if (reduceMq.matches) { paintStatic(); return; }
    if (running) return;
    running = true; last = 0;
    raf = window.requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) window.cancelAnimationFrame(raf);
    raf = null;
    paintStatic();
    folios.forEach(function (f) { f.style.transform = ''; });
  }

  if (canvas && ctx) {
    resize();
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { resize(); if (!running) { paintStatic(); parallax(); } }, 150);
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    reduceMq.addEventListener('change', function () {
      if (reduceMq.matches) stop(); else start();
    });
    start();
  }

  /* ---------- pointer lamp ---------- */
  if (lamp && finePointer.matches) {
    var lx = W / 2, ly = H / 3, tx = lx, ty = ly, lampRaf = null;
    function lampFrame() {
      lx += (tx - lx) * 0.08;
      ly += (ty - ly) * 0.08;
      lamp.style.setProperty('--lx', lx.toFixed(0) + 'px');
      lamp.style.setProperty('--ly', ly.toFixed(0) + 'px');
      if (Math.abs(tx - lx) > 0.5 || Math.abs(ty - ly) > 0.5) {
        lampRaf = window.requestAnimationFrame(lampFrame);
      } else { lampRaf = null; }
    }
    window.addEventListener('pointermove', function (e) {
      if (reduceMq.matches) return;
      tx = e.clientX; ty = e.clientY;
      lamp.classList.add('lit');
      if (!lampRaf) lampRaf = window.requestAnimationFrame(lampFrame);
    }, { passive: true });
    document.addEventListener('pointerleave', function () { lamp.classList.remove('lit'); });
  }

  /* ---------- headline entrance: lines rise in sequence ---------- */
  if (!reduceMq.matches) {
    var lines = document.querySelectorAll('.hl-line');
    lines.forEach(function (el, i) {
      el.classList.add('hl-enter');
      el.style.animationDelay = (0.12 + i * 0.14) + 's';
    });
    var wrong = document.querySelector('.hl-wrong');
    if (wrong) wrong.classList.add('wrong-settle');
  }

  /* ---------- stamp on confirm ---------- */
  window.mysterydStamp = function (box) {
    if (!box || reduceMq.matches) return;
    box.classList.add('stamped');
  };

  typewrite();
})();