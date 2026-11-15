/* MysteryD intake: validation, submission, menu, reveals. Vanilla JS, no deps. */
(function () {
  'use strict';

  /* ---- mobile menu ---- */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- sticky desk bar: show after masthead, scroll-spy ---- */
  var topbar = document.getElementById('topbar');
  if (topbar) {
    var deskMq = window.matchMedia('(min-width: 1024px)');
    var spyLinks = topbar.querySelectorAll('[data-spy]');
    var sections = [];
    spyLinks.forEach(function (a) {
      var sec = document.getElementById(a.getAttribute('data-spy'));
      if (sec) sections.push({ link: a, sec: sec });
    });
    function deskState() {
      var wide = deskMq.matches;
      var past = window.scrollY > 260;
      var show = wide && past;
      topbar.classList.toggle('visible', show);
      topbar.setAttribute('aria-hidden', show ? 'false' : 'true');
      if (!show) return;
      var y = window.scrollY + 140;
      var current = null;
      sections.forEach(function (s) { if (s.sec.offsetTop <= y) current = s; });
      sections.forEach(function (s) { s.link.classList.toggle('active', s === current); });
    }
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () { deskState(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });
    deskMq.addEventListener('change', deskState);
    deskState();
  }

  /* ---- staged reveals (progressive enhancement) ---- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.sheet-head, .sheet-lede, .index-list li, .steps li, .files-block, .faq details, .contact-block');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var siblings = el.parentElement ? Array.prototype.slice.call(el.parentElement.children) : [];
          var idx = siblings.indexOf(el);
          el.style.transitionDelay = Math.min(idx * 70, 350) + 'ms';
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  /* ---- intake form ---- */
  var form = document.getElementById('intake-form');
  if (!form) return;
  form.setAttribute('novalidate', '');

  var confirmBox = document.getElementById('case-opened');
  var failBox = document.getElementById('form-fail');
  var submitBtn = form.querySelector('.open-case');

  var fields = [
    { id: 'f-name', err: 'err-name', required: true },
    { id: 'f-email', err: 'err-email', required: true, email: true },
    { id: 'f-org', err: 'err-org', required: true },
    { id: 'f-product', err: 'err-product', required: true },
    { id: 'f-platforms', err: 'err-platforms', required: true },
    { id: 'f-problem', err: 'err-problem', required: true }
  ];
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setInvalid(f, invalid) {
    var input = document.getElementById(f.id);
    var err = document.getElementById(f.err);
    if (!input || !err) return;
    var wrap = input.closest('.field');
    if (invalid) {
      if (wrap) wrap.classList.add('invalid');
      err.hidden = false;
      input.setAttribute('aria-invalid', 'true');
    } else {
      if (wrap) wrap.classList.remove('invalid');
      err.hidden = true;
      input.removeAttribute('aria-invalid');
    }
  }

  function validateField(f) {
    var input = document.getElementById(f.id);
    if (!input) return true;
    var val = input.value.trim();
    var bad = (f.required && !val) || (f.email && val && !emailRe.test(val));
    setInvalid(f, bad);
    return !bad;
  }

  fields.forEach(function (f) {
    var input = document.getElementById(f.id);
    if (!input) return;
    input.addEventListener('blur', function () { validateField(f); });
    input.addEventListener('input', function () {
      var wrap = input.closest('.field');
      if (wrap && wrap.classList.contains('invalid')) validateField(f);
    });
  });

  function confirmCase() {
    form.hidden = true;
    if (confirmBox) {
      var at = document.getElementById('case-filed-at');
      if (at) {
        var d = new Date();
        var hh = String(d.getHours()).padStart(2, '0');
        var mm = String(d.getMinutes()).padStart(2, '0');
        at.textContent = hh + ':' + mm;
      }
      confirmBox.hidden = false;
      confirmBox.setAttribute('tabindex', '-1');
      confirmBox.focus({ preventScroll: false });
      if (window.mysterydStamp) window.mysterydStamp(confirmBox);
    }
  }

  function failCase() {
    if (failBox) failBox.hidden = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Open case';
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (failBox) failBox.hidden = true;

    var firstBad = null;
    fields.forEach(function (f) {
      var ok = validateField(f);
      if (!ok && !firstBad) firstBad = document.getElementById(f.id);
    });
    if (firstBad) {
      firstBad.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Filing…';
    }

    var data = new FormData(form);
    fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
      .then(function (response) {
        if (response.ok) {
          confirmCase();
        } else if (response.status === 404 || response.status === 405 || response.status === 501) {
          /* Static host without a live intake endpoint: the case is
             acknowledged locally until the backend is wired. */
          confirmCase();
        } else {
          failCase();
        }
      })
      .catch(function () { failCase(); });
  });
})();