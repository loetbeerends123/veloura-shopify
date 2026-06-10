/* ============================================================
   VELOURA — veloura.js
   Vanilla interactions layered on Dawn. No dependencies.
   Covers PRD §10 & §12: reveal, before/after slider, FAQ accordion,
   bundle selector, sticky cart bar, product gallery.
   Cart add-to-cart + drawer is handled by Dawn (product-form.js /
   cart-drawer.js); this file only drives bespoke UI.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Page load reveal --------------------------------------------------- */
  function markLoaded() { document.body.classList.add('is-loaded'); }
  if (document.readyState === 'complete') markLoaded();
  else window.addEventListener('load', markLoaded);

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  var money = (window.Shopify && Shopify.formatMoney) ? null : null; // Dawn provides formatting server-side; we use pre-rendered strings.

  /* ========================================================================
     1. Before / After comparison slider (PRD §1.2, §2.4, §10.4)
     ======================================================================== */
  function initBeforeAfter(root) {
    var range = root.querySelector('input[type="range"]');
    var beforeWrap = root.querySelector('.v-ba__before-wrap');
    var handle = root.querySelector('.v-ba__handle');
    if (!range || !beforeWrap || !handle) return;

    function setPos(pct) {
      pct = Math.max(0, Math.min(100, pct));
      beforeWrap.style.width = pct + '%';
      handle.style.left = pct + '%';
      range.value = pct;
    }

    range.addEventListener('input', function () { setPos(parseFloat(range.value)); });
    setPos(50);

    // One-time hint animation 50 -> 30 -> 50 over 1.5s (PRD §10.4)
    if (!reduceMotion) {
      var seen = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting || seen) return;
          seen = true;
          io.disconnect();
          var start = null, dur = 1500;
          function frame(t) {
            if (start === null) start = t;
            var p = Math.min((t - start) / dur, 1);
            // ease-in-out triangle: 50 -> 30 -> 50
            var tri = p < 0.5 ? p * 2 : (1 - p) * 2;
            var eased = tri < 0.5 ? 2 * tri * tri : 1 - Math.pow(-2 * tri + 2, 2) / 2;
            setPos(50 - eased * 20);
            if (p < 1) requestAnimationFrame(frame); else setPos(50);
          }
          requestAnimationFrame(frame);
        });
      }, { threshold: 0.4 });
      io.observe(root);
    }
  }

  /* ========================================================================
     2. FAQ accordion (PRD §2.3, §10.5) — single open
     ======================================================================== */
  function initFaq(root) {
    var items = Array.prototype.slice.call(root.querySelectorAll('.v-faq__item'));
    items.forEach(function (item) {
      var btn = item.querySelector('.v-faq__q');
      var panel = item.querySelector('.v-faq__a');
      if (!btn || !panel) return;
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');
        items.forEach(function (other) {
          other.classList.remove('is-open');
          var p = other.querySelector('.v-faq__a');
          var b = other.querySelector('.v-faq__q');
          if (p) p.style.maxHeight = null;
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          panel.style.maxHeight = panel.scrollHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ========================================================================
     3. Bundle selector (PRD §1.4, §2.1) — radio tiers + tier-2 reveal
     Updates the displayed price, the hidden quantity for add-to-cart,
     and broadcasts the price to the sticky bar.
     ======================================================================== */
  function initBundle(root) {
    var tiers = Array.prototype.slice.call(root.querySelectorAll('.v-tier'));
    var qtyInput = root.querySelector('[data-bundle-qty]');
    var priceOut = document.querySelectorAll('[data-bundle-price]');

    function select(tier) {
      tiers.forEach(function (t) {
        var on = t === tier;
        t.classList.toggle('is-selected', on);
        var radio = t.querySelector('input[type="radio"]');
        if (radio) radio.checked = on;
        var reveal = t.querySelector('.v-tier__reveal');
        if (reveal) reveal.style.maxHeight = on ? reveal.scrollHeight + 'px' : null;
      });
      var qty = tier.getAttribute('data-qty') || '1';
      var price = tier.getAttribute('data-price') || '';
      if (qtyInput) qtyInput.value = qty;
      priceOut.forEach(function (el) { el.textContent = price; });
      root.dispatchEvent(new CustomEvent('veloura:bundlechange', { bubbles: true, detail: { qty: qty, price: price } }));
    }

    tiers.forEach(function (tier) {
      tier.addEventListener('click', function (e) {
        if (e.target.closest('select')) return; // don't re-select when using dropdowns
        select(tier);
      });
      var radio = tier.querySelector('input[type="radio"]');
      if (radio) radio.addEventListener('change', function () { if (radio.checked) select(tier); });
    });

    var preselected = root.querySelector('.v-tier[data-default]') || tiers[0];
    if (preselected) select(preselected);
  }

  /* ========================================================================
     4. Sticky bottom cart bar (PRD §2.7, §10.3)
     Visible once the in-page ATC scrolls out of view.
     ======================================================================== */
  function initStickyBar() {
    var bar = document.querySelector('[data-sticky-bar]');
    var anchor = document.querySelector('[data-atc-anchor]');
    if (!bar || !anchor || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        bar.classList.toggle('is-visible', !e.isIntersecting && e.boundingClientRect.top < 0);
      });
    }, { threshold: 0, rootMargin: '0px 0px -100% 0px' });
    io.observe(anchor);
  }

  /* ========================================================================
     5. Product gallery thumbnails (PRD §2.0) — crossfade main image
     ======================================================================== */
  function initGallery(root) {
    var main = root.querySelector('[data-gallery-main]');
    var thumbs = Array.prototype.slice.call(root.querySelectorAll('[data-gallery-thumb]'));
    if (!main || !thumbs.length) return;
    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var src = thumb.getAttribute('data-src');
        if (!src || src === main.getAttribute('src')) return;
        thumbs.forEach(function (t) { t.classList.remove('is-active'); });
        thumb.classList.add('is-active');
        main.style.opacity = '0';
        setTimeout(function () {
          main.src = src;
          var alt = thumb.getAttribute('data-alt');
          if (alt) main.alt = alt;
          main.style.opacity = '1';
        }, 150);
      });
    });
  }

  /* ========================================================================
     6. Sticky-bar "Start My Transformation" re-triggers in-page ATC (PRD §2.7)
     ======================================================================== */
  function initStickyAtc() {
    document.querySelectorAll('[data-sticky-atc]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var addBtn = document.querySelector('[data-atc-form] [name="add"]');
        if (addBtn) { addBtn.click(); return; }
        var form = document.querySelector('[data-atc-form]');
        if (form && form.requestSubmit) form.requestSubmit();
      });
    });
  }

  /* Expose live header height for sticky offsets */
  function setHeaderHeight() {
    var header = document.querySelector('.header-wrapper, .shopify-section-group-header-group, sticky-header, header');
    if (header) document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
  }

  /* ---- Boot --------------------------------------------------------------- */
  ready(function () {
    setHeaderHeight();
    initStickyAtc();
    document.querySelectorAll('[data-before-after]').forEach(initBeforeAfter);
    document.querySelectorAll('[data-faq]').forEach(initFaq);
    document.querySelectorAll('[data-bundle]').forEach(initBundle);
    document.querySelectorAll('[data-gallery]').forEach(initGallery);
    initStickyBar();
  });

  window.addEventListener('resize', setHeaderHeight);

  // Re-init within the Shopify theme editor when sections are re-rendered.
  document.addEventListener('shopify:section:load', function (e) {
    var s = e.target;
    s.querySelectorAll('[data-before-after]').forEach(initBeforeAfter);
    s.querySelectorAll('[data-faq]').forEach(initFaq);
    s.querySelectorAll('[data-bundle]').forEach(initBundle);
    s.querySelectorAll('[data-gallery]').forEach(initGallery);
    initStickyBar();
  });
})();
