/* Hydrochill — site behaviour. No dependencies. */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Footer year ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile navigation ---------- */
  var header = $('#site-header');
  var nav = $('#site-nav');
  var toggle = $('.nav-toggle');
  var desktopMQ = window.matchMedia('(min-width: 1080px)');

  function setNav(open, returnFocus) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    if (!open && returnFocus) toggle.focus();
  }
  toggle.addEventListener('click', function () { setNav(!nav.classList.contains('is-open')); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setNav(false, true);
  });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !header.contains(e.target)) setNav(false);
  });
  var onMQ = function () { if (desktopMQ.matches) setNav(false); };
  if (desktopMQ.addEventListener) desktopMQ.addEventListener('change', onMQ); else desktopMQ.addListener(onMQ);

  /* ---------- Sticky header state + back-to-top ---------- */
  var toTop = $('#to-top');
  var ticking = false;
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    header.classList.toggle('is-scrolled', y > 24);
    toTop.classList.toggle('is-visible', y > 700);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    var home = $('#home');
    if (home) { home.setAttribute('tabindex', '-1'); home.focus({ preventScroll: true }); }
  });

  /* ---------- Active nav link ---------- */
  var linkFor = {};
  $$('a[href^="#"]', nav).forEach(function (a) {
    if (!a.classList.contains('btn')) linkFor[a.getAttribute('href').slice(1)] = a;
  });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && linkFor[en.target.id]) {
          Object.keys(linkFor).forEach(function (id) { linkFor[id].removeAttribute('aria-current'); });
          linkFor[en.target.id].setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(linkFor).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });

    /* ---------- Scroll reveal ---------- */
    var reveal = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); obs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('.reveal').forEach(function (el) { reveal.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Product "Quote by form" pre-selects the product ---------- */
  var productSelect = $('#f-product');
  $$('a[data-product]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (productSelect) { productSelect.value = a.getAttribute('data-product'); clearError(productSelect); }
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var lb = $('#lightbox');
  var items = $$('#gallery-grid button[data-full]');
  var lbIndex = 0;
  function showImage(i) {
    lbIndex = (i + items.length) % items.length;
    var b = items[lbIndex];
    var img = $('#lb-img');
    img.src = b.getAttribute('data-full');
    img.alt = b.getAttribute('data-alt') || '';
    $('#lb-caption').textContent = b.getAttribute('data-caption') || '';
    $('#lb-count').textContent = '(' + (lbIndex + 1) + ' of ' + items.length + ')';
  }
  if (lb && typeof lb.showModal === 'function') {
    items.forEach(function (b, i) {
      b.addEventListener('click', function () { showImage(i); lb.showModal(); });
    });
    $('#lb-close').addEventListener('click', function () { lb.close(); });
    $('#lb-prev').addEventListener('click', function () { showImage(lbIndex - 1); });
    $('#lb-next').addEventListener('click', function () { showImage(lbIndex + 1); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); showImage(lbIndex - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); showImage(lbIndex + 1); }
    });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lightbox-figure')) lb.close();
    });
  } else {
    // Very old browsers: open the full image directly.
    items.forEach(function (b) {
      b.addEventListener('click', function () { window.open(b.getAttribute('data-full'), '_blank', 'noopener'); });
    });
  }

  /* ---------- Inquiry form ---------- */
  var form = $('#inquiry-form');
  var statusBox = $('#form-status');
  var submitBtn = $('#submit-btn');
  var waBtn = $('#wa-btn');
  var WHATSAPP = form.getAttribute('data-whatsapp');
  var ENDPOINT = form.getAttribute('data-endpoint');
  var EMAIL = 'hydrochillcoolingpad1@gmail.com';
  form.setAttribute('novalidate', '');   // custom messages below; native validation remains without JS

  var rules = {
    name:        function (v) { return v.trim().length >= 2; },
    email:       function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
    phone:       function (v) { return /^[+\d][\d\s\-()]*$/.test(v.trim()) && v.replace(/\D/g, '').length >= 7; },
    product:     function (v) { return v !== ''; },
    application: function (v) { return v !== ''; },
    message:     function (v) { return v.trim().length >= 10; }
  };

  function fieldOf(name) { return form.elements[name]; }
  function clearError(el) { el.removeAttribute('aria-invalid'); }
  function validateField(name) {
    var el = fieldOf(name);
    var ok = rules[name](el.value);
    if (ok) clearError(el); else el.setAttribute('aria-invalid', 'true');
    return ok;
  }
  function validate(names) {
    var firstBad = null;
    names.forEach(function (n) { if (!validateField(n) && !firstBad) firstBad = fieldOf(n); });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }
  Object.keys(rules).forEach(function (n) {
    var el = fieldOf(n);
    el.addEventListener('blur', function () { if (el.value !== '' || el.hasAttribute('aria-invalid')) validateField(n); });
    el.addEventListener('input', function () { if (el.hasAttribute('aria-invalid')) validateField(n); });
    el.addEventListener('change', function () { if (el.hasAttribute('aria-invalid')) validateField(n); });
  });

  function setStatus(kind, html) {
    statusBox.className = 'form-status' + (kind ? ' is-' + kind : '');
    statusBox.innerHTML = html;
  }

  function waText() {
    var v = function (n) { return (fieldOf(n).value || '').trim(); };
    var lines = ['Hello Hydrochill, I would like a quote for evaporative cooling pads.'];
    lines.push('Name: ' + v('name'));
    if (v('company')) lines.push('Company: ' + v('company'));
    if (v('phone')) lines.push('Phone: ' + v('phone'));
    if (v('email')) lines.push('Email: ' + v('email'));
    lines.push('Product: ' + v('product'));
    lines.push('Application: ' + v('application'));
    lines.push('Message: ' + v('message').slice(0, 800));
    return lines.join('\n');
  }

  waBtn.addEventListener('click', function () {
    if (!validate(['name', 'product', 'application', 'message'])) {
      setStatus('error', 'Please complete the highlighted fields first.');
      return;
    }
    var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(waText());
    window.open(url, '_blank', 'noopener');
    setStatus('info', 'WhatsApp has opened with your details. Press send in WhatsApp to deliver your message; it has not been sent yet.');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (fieldOf('_gotcha').value) return;                 // honeypot: bots fill hidden fields
    if (!validate(['name', 'email', 'phone', 'product', 'application', 'message'])) {
      setStatus('error', 'Please correct the highlighted fields and try again.');
      return;
    }
    var fallback = ' You can also reach us on <a href="https://wa.me/' + WHATSAPP + '" target="_blank" rel="noopener">WhatsApp</a> or at <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.';
    submitBtn.disabled = true; waBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    setStatus('info', 'Sending your inquiry...');

    var ctrl = ('AbortController' in window) ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 20000) : null;

    fetch(ENDPOINT, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' },
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) { return { ok: res.ok, data: data }; });
    }).then(function (r) {
      if (r.ok) {
        form.reset();
        $$('[aria-invalid]', form).forEach(clearError);
        setStatus('success', '<strong>Inquiry sent.</strong> Hydrochill has received your message and will reply during business hours (Saturday to Thursday, 8 AM to 6 PM).');
      } else {
        var detail = (r.data && r.data.errors && r.data.errors[0] && r.data.errors[0].message) ? ' (' + String(r.data.errors[0].message).replace(/[<>&]/g, '') + ')' : '';
        setStatus('error', '<strong>Your inquiry was not sent' + detail + '.</strong>' + fallback);
      }
    }).catch(function () {
      setStatus('error', '<strong>Your inquiry was not sent.</strong> Check your connection and try again.' + fallback);
    }).then(function () {
      if (timer) clearTimeout(timer);
      submitBtn.disabled = false; waBtn.disabled = false;
      submitBtn.textContent = 'Send inquiry';
    });
  });
})();
