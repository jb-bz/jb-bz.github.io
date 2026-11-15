/* MysteryD atmosphere: a living case file. Vanilla JS, no deps.
   - drifting elder-sigil field on a fixed canvas (subtle, viridian ink)
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

  /* ---------- sigil field ---------- */
  var canvas = document.getElementById('sigil-field');
  var lamp = document.getElementById('lamp');
  var ctx = canvas ? canvas.getContext('2d') : null;
  var sigils = [];
  var raf = null;
  var running = false;
  var W = 0, H = 0, DPR = 1;

  /* An elder sign: five-pointed star inscribed in a broken ring,
     with an eye at the center. Drawn once per sigil per frame. */
  function drawSigil(c, s, t) {
    var wob = Math.sin(t * s.wobSpeed + s.phase) * 0.06;
    var rot = s.rot + t * s.spin + wob;
    var breathe = 1 + Math.sin(t * 0.4 + s.phase) * 0.04;
    var r = s.r * breathe;
    c.save();
    c.translate(s.x, s.y);
    c.rotate(rot);
    c.globalAlpha = s.alpha * (0.75 + 0.25 * Math.sin(t * 0.3 + s.phase));
    c.strokeStyle = s.color;
    c.lineWidth = s.lw;
    c.lineCap = 'round';
    /* broken outer ring */
    c.beginPath();
    c.arc(0, 0, r, 0.35, Math.PI * 2 - 0.35);
    c.stroke();
    /* inner star */
    c.beginPath();
    for (var k = 0; k <= 5; k++) {
      var a = -Math.PI / 2 + (k * 4 * Math.PI) / 5;
      var x = Math.cos(a) * r * 0.78;
      var y = Math.sin(a) * r * 0.78;
      if (k === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.stroke();
    /* the eye */
    c.beginPath();
    c.ellipse(0, 0, r * 0.22, r * 0.13, 0, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.arc(0, 0, r * 0.05, 0, Math.PI * 2);
    c.fillStyle = s.color;
    c.fill();
    c.restore();
  }

  function seed() {
    sigils = [];
    var count = Math.max(5, Math.min(11, Math.round((W * H) / 160000)));
    var palette = ['rgba(30,110,90,', 'rgba(87,80,63,', 'rgba(146,116,70,'];
    for (var i = 0; i < count; i++) {
      sigils.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 26 + Math.random() * 60,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.05,
        wobSpeed: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 5,
        vy: -3 - Math.random() * 6,
        alpha: 0.05 + Math.random() * 0.07,
        lw: 1 + Math.random() * 0.8,
        color: palette[i % palette.length]
      });
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
      if (s.y < -s.r * 2) { s.y = H + s.r * 2; s.x = Math.random() * W; }
      if (s.x < -s.r * 2) s.x = W + s.r * 2;
      if (s.x > W + s.r * 2) s.x = -s.r * 2;
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

  function start() {
    if (running || !ctx || reduceMq.matches) return;
    running = true; last = 0;
    raf = window.requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) window.cancelAnimationFrame(raf);
    raf = null;
    if (ctx) ctx.clearRect(0, 0, W, H);
    folios.forEach(function (f) { f.style.transform = ''; });
  }

  if (canvas && ctx) {
    resize();
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { resize(); if (!running) parallax(); }, 150);
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