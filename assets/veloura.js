/* ============================================================
   VELOURA — veloura.js
   Vanilla interactions layered on Dawn. No dependencies.
   Covers PRD §10 & §12: reveal, before/after slider, FAQ accordion,
   sticky cart bar, product gallery, cart-page upsell sync.
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
      root.style.setProperty('--v-ba-pos', pct + '%');
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
      // The static `hidden` keeps panels out of AT/tab order without JS;
      // once JS drives the accordion, visibility is handled via CSS (.is-open).
      panel.removeAttribute('hidden');
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
    // Keep the open panel un-clipped when text reflows (resize, font swap).
    window.addEventListener('resize', function () {
      var open = root.querySelector('.v-faq__item.is-open .v-faq__a');
      if (open) open.style.maxHeight = open.scrollHeight + 'px';
    });
  }

  /* ========================================================================
     3. Cart-page upsell (PRD §7, §10.2) — adds the upsell product via the
     Cart API + Section Rendering API so the /cart page updates in place
     (items, totals, upsell state, header bubble, drawer) without opening
     the drawer over the page.
     ======================================================================== */
  function initCartUpsell(root) {
    var form = root.querySelector('[data-v-upsell-form]');
    if (!form) return;
    var sectionId = root.getAttribute('data-section-id');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn && btn.disabled) return;
      var originalLabel = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Adding…'; }

      // Mirror Dawn cart.js getSectionsToRender(): page sections via their
      // data-id, plus the upsell section itself, header bubble and drawer.
      var targets = [];
      var items = document.getElementById('main-cart-items');
      var footer = document.getElementById('main-cart-footer');
      if (items) targets.push({ section: items.dataset.id, apply: function (doc) { patchInner(doc, items.dataset.id, '#main-cart-items .js-contents', '#main-cart-items .js-contents'); } });
      if (footer) targets.push({ section: footer.dataset.id, apply: function (doc) { patchInner(doc, footer.dataset.id, '#main-cart-footer .js-contents', '#main-cart-footer .js-contents'); } });
      if (sectionId) targets.push({ section: sectionId, apply: function (doc) { patchSection(doc, sectionId); } });
      // Header cart badge: the element is #cart-icon-bubble inside the header
      // (there is no #shopify-section-cart-icon-bubble wrapper on the page).
      targets.push({ section: 'cart-icon-bubble', apply: function (doc) { patchInner(doc, 'cart-icon-bubble', '.shopify-section', '#cart-icon-bubble'); } });
      if (document.querySelector('cart-drawer')) {
        targets.push({ section: 'cart-drawer', apply: function (doc) { patchInner(doc, 'cart-drawer', '#CartDrawer', '#CartDrawer'); } });
      }

      var data = new FormData(form);
      data.append('sections', targets.map(function (t) { return t.section; }).join(','));
      // NOTE: no sections_url — this store's /cart/add rejects it with a 400
      // ("sections_url must be a relative path"); sections render fine without it.

      var sectionsHtml = {};
      function patchSection(sections, id) {
        var target = document.getElementById('shopify-section-' + id);
        if (target && sections[id]) target.innerHTML = new DOMParser().parseFromString(sections[id], 'text/html').querySelector('.shopify-section').innerHTML;
      }
      function patchInner(sections, id, sourceSel, targetSel) {
        var target = document.querySelector(targetSel);
        if (!target || !sections[id]) return;
        var source = new DOMParser().parseFromString(sections[id], 'text/html').querySelector(sourceSel);
        if (source) target.innerHTML = source.innerHTML;
      }

      fetch(window.routes && routes.cart_add_url ? routes.cart_add_url : '/cart/add', {
        method: 'POST',
        headers: { Accept: 'application/javascript', 'X-Requested-With': 'XMLHttpRequest' },
        body: data
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Add to cart failed: HTTP ' + res.status);
          return res.json();
        })
        .then(function (state) {
          if (state.status || state.errors) throw new Error(state.description || state.errors || 'Add to cart failed');
          sectionsHtml = state.sections || {};
          targets.forEach(function (t) { t.apply(sectionsHtml); });
          // Re-bind any freshly rendered upsell section (now shows the added state).
          document.querySelectorAll('[data-v-upsell]').forEach(initCartUpsell);
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = originalLabel; }
        });
    });
  }

  /* ========================================================================
     3b. Variant picker — maps the colour/size selects to the real variant id
     so add-to-cart adds the chosen variant (any bundle quantity).
     ======================================================================== */
  function initVariantPicker(root) {
    var dataEl = root.querySelector('[data-pdp-variants]');
    var idInput = root.querySelector('[data-variant-id]');
    if (!dataEl || !idInput) return;
    var variants;
    try { variants = JSON.parse(dataEl.textContent); } catch (e) { return; }
    var selects = Array.prototype.slice.call(root.querySelectorAll('[data-pdp-option]'));
    if (!selects.length) return;
    var addBtn = root.querySelector('[data-atc-form] [name="add"]');
    var addLabel = addBtn ? addBtn.querySelector('span') : null;
    // Don't capture the rendered label: if the first variant is sold out it
    // would poison every available variant with "Sold out".
    var availableText = (window.variantStrings && window.variantStrings.addToCart) || 'Add to Cart';
    if (addLabel && addBtn && !addBtn.disabled) availableText = addLabel.textContent;

    function update() {
      var chosen = selects.map(function (s) { return s.value; });
      var match = null;
      for (var i = 0; i < variants.length; i++) {
        var v = variants[i], ok = true;
        for (var j = 0; j < chosen.length; j++) {
          if (String(v.options[j]) !== String(chosen[j])) { ok = false; break; }
        }
        if (ok) { match = v; break; }
      }
      if (!match) return;
      idInput.value = match.id;
      if (addBtn) addBtn.disabled = !match.available;
      if (addLabel) addLabel.textContent = match.available ? availableText : 'Sold out';
    }

    selects.forEach(function (s) { s.addEventListener('change', update); });
    update();
  }

  /* ========================================================================
     4. Sticky bottom cart bar (PRD §2.7, §10.3)
     Visible once the in-page ATC scrolls out of view.
     ======================================================================== */
  function initStickyBar() {
    var bar = document.querySelector('[data-sticky-bar]');
    var anchor = document.querySelector('[data-atc-anchor]');
    if (!bar || !anchor || !('IntersectionObserver' in window)) return;
    // Theme editor re-runs this on section reloads; drop the old observer.
    if (bar._vIo) bar._vIo.disconnect();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var show = !e.isIntersecting && e.boundingClientRect.top < 0;
        bar.classList.toggle('is-visible', show);
        bar.setAttribute('aria-hidden', show ? 'false' : 'true');
        bar.toggleAttribute('inert', !show);
        // Reserve space so the fixed bar never covers the footer/last CTA.
        document.body.style.paddingBottom = show ? bar.offsetHeight + 'px' : '';
      });
    }, { threshold: 0, rootMargin: '0px 0px -100% 0px' });
    io.observe(anchor);
    bar._vIo = io;
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
          // Wait for the new image to decode so the fade-in never shows a blank frame.
          var show = function () { main.style.opacity = '1'; };
          if (main.decode) main.decode().then(show, show);
          else if (main.complete) show();
          else main.onload = show;
        }, 150);
      });
    });
  }

  /* ========================================================================
     5a. Write-a-review form toggle. Reveals the contact-backed review form;
     keeps it open after a successful submit (success message present).
     ======================================================================== */
  function initReviewForm(root) {
    var scope = root || document;
    var btn = scope.querySelector('[data-review-toggle]');
    var form = scope.querySelector('[data-review-form]');
    if (!btn || !form) return;
    if (form.querySelector('.v-reviews__form-success')) {
      form.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
    }
    btn.addEventListener('click', function () {
      var willShow = form.hidden;
      form.hidden = !willShow;
      btn.setAttribute('aria-expanded', willShow ? 'true' : 'false');
      if (willShow) { var f = form.querySelector('input, textarea'); if (f) f.focus(); }
    });
  }

  /* ========================================================================
     5d. Review photo lightbox. Click a review thumbnail to view it enlarged.
     ======================================================================== */
  function initReviewLightbox() {
    var imgs = document.querySelectorAll('.v-review__photos img, .v-reviews__photos img');
    if (!imgs.length) return;
    var dlg = document.querySelector('[data-review-lightbox]');
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.className = 'v-lightbox';
      dlg.setAttribute('data-review-lightbox', '');
      dlg.innerHTML = '<button type="button" class="v-lightbox__close" aria-label="Close">×</button><img class="v-lightbox__img" alt="">';
      document.body.appendChild(dlg);
      dlg.querySelector('.v-lightbox__close').addEventListener('click', function () { if (dlg.close) dlg.close(); });
      dlg.addEventListener('click', function (e) { if (e.target === dlg && dlg.close) dlg.close(); });
    }
    var lbImg = dlg.querySelector('.v-lightbox__img');
    function open(img) {
      var full = (img.currentSrc || img.src || '').replace(/width=\d+/, 'width=1400');
      lbImg.src = full;
      lbImg.alt = img.alt || '';
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    }
    imgs.forEach(function (img) {
      if (img._vLb) return;
      img._vLb = true;
      img.style.cursor = 'zoom-in';
      img.setAttribute('role', 'button');
      img.setAttribute('tabindex', '0');
      img.addEventListener('click', function () { open(img); });
      img.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); } });
    });
  }

  /* ========================================================================
     5c. Size-guide modal (native <dialog>). Opens from the buy box button.
     ======================================================================== */
  function initSizeGuide(root) {
    var scope = root || document;
    var dlg = scope.querySelector('[data-sizeguide]');
    var openBtn = scope.querySelector('[data-sizeguide-open]');
    if (!dlg || !openBtn || dlg._vInit) return;
    dlg._vInit = true;
    openBtn.addEventListener('click', function () {
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    });
    dlg.querySelectorAll('[data-sizeguide-close]').forEach(function (b) {
      b.addEventListener('click', function () { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); });
    });
    dlg.addEventListener('click', function (e) { if (e.target === dlg && dlg.close) dlg.close(); });
  }

  /* ========================================================================
     5b. Colour → main image sync with the Kaching bundle app.
     The bundle app owns colour/size selection; when the shopper picks a
     colour there, swap the left gallery image to that colour's photo.
     App-agnostic: watches bubbling change events (selects/radios) and
     clicks (swatch buttons) for any of our known colour names.
     ======================================================================== */
  function initColorImageSync(root) {
    if (root._vColorSync) return;
    var dataEl = root.querySelector('[data-pdp-color-images]');
    var main = root.querySelector('[data-gallery-main]');
    if (!dataEl || !main) return;
    var list;
    try { list = JSON.parse(dataEl.textContent); } catch (e) { return; }
    var map = {};
    list.forEach(function (item) {
      if (!item || !item.color || !item.src) return;
      var key = String(item.color).trim().toLowerCase();
      if (!map[key]) map[key] = { src: item.src, alt: item.alt || '' };
    });
    var colors = Object.keys(map);
    if (!colors.length) return;
    root._vColorSync = true;

    var thumbs = Array.prototype.slice.call(root.querySelectorAll('[data-gallery-thumb]'));

    function swapTo(entry) {
      if (!entry || !entry.src || entry.src === main.getAttribute('src')) return;
      main.style.opacity = '0';
      setTimeout(function () {
        main.src = entry.src;
        if (entry.alt) main.alt = entry.alt;
        var show = function () { main.style.opacity = '1'; };
        if (main.decode) main.decode().then(show, show);
        else if (main.complete) show();
        else main.onload = show;
      }, 150);
      thumbs.forEach(function (t) {
        t.classList.toggle('is-active', t.getAttribute('data-src') === entry.src);
      });
      // On phones the photo sits above the fold, so a colour change isn't
      // visible from the selector. Bring the gallery into view when it's
      // scrolled out of sight, so the shopper actually sees the swap.
      if (window.matchMedia && window.matchMedia('(max-width: 749px)').matches) {
        var r = root.getBoundingClientRect();
        if (r.bottom < 120 || r.top > window.innerHeight) {
          try { root.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
          catch (e) { root.scrollIntoView(); }
        }
      }
    }

    // Return the colour entry named anywhere in a string (exact, then contains).
    function matchColor(str) {
      if (!str) return null;
      var s = String(str).trim().toLowerCase();
      if (!s) return null;
      if (map[s]) return map[s];
      for (var i = 0; i < colors.length; i++) {
        if (s.indexOf(colors[i]) !== -1) return map[colors[i]];
      }
      return null;
    }

    // Form controls (selects/radios) inside the bundle app bubble 'change'.
    document.addEventListener('change', function (e) {
      var t = e.target;
      if (!t || !t.getAttribute) return;
      var entry = matchColor(t.value) ||
                  matchColor(t.getAttribute('data-value')) ||
                  matchColor(t.getAttribute('data-color')) ||
                  matchColor(t.getAttribute('aria-label'));
      if (entry) swapTo(entry);
    }, true);

    // Swatch-style buttons/divs: read attributes + short text on click.
    document.addEventListener('click', function (e) {
      var el = e.target;
      for (var hops = 0; el && el.getAttribute && hops < 4; hops++, el = el.parentElement) {
        var txt = el.textContent && el.textContent.length < 40 ? el.textContent : '';
        var entry = matchColor(el.getAttribute('data-value')) ||
                    matchColor(el.getAttribute('data-color')) ||
                    matchColor(el.getAttribute('title')) ||
                    matchColor(el.getAttribute('aria-label')) ||
                    matchColor(txt);
        if (entry) { swapTo(entry); return; }
      }
    }, true);
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

  /* ========================================================================
     7. Relabel the "Catalog" header link -> "Cellulite Leggings"
     (Menu text is store data; this keeps the visible label on-brand.)
     ======================================================================== */
  function relabelNav() {
    var targets = document.querySelectorAll(
      '.header__inline-menu a, .header__inline-menu summary span, .menu-drawer__menu a, .menu-drawer__menu summary span'
    );
    targets.forEach(function (el) {
      var t = (el.textContent || '').trim();
      if (t.toLowerCase() === 'catalog') {
        // replace only the text node, preserve any child markup/icons
        el.childNodes.forEach(function (n) {
          if (n.nodeType === 3 && n.textContent.trim()) n.textContent = 'Cellulite Leggings';
        });
        if (!el.querySelector('*') && el.textContent.trim() !== 'Cellulite Leggings') {
          el.textContent = 'Cellulite Leggings';
        }
      }
    });
  }

  /* ---- Boot --------------------------------------------------------------- */
  ready(function () {
    setHeaderHeight();
    relabelNav();
    initStickyAtc();
    document.querySelectorAll('[data-before-after]').forEach(initBeforeAfter);
    document.querySelectorAll('[data-faq]').forEach(initFaq);
    document.querySelectorAll('[data-v-upsell]').forEach(initCartUpsell);
    document.querySelectorAll('.v-pdp').forEach(initVariantPicker);
    document.querySelectorAll('[data-gallery]').forEach(initGallery);
    document.querySelectorAll('[data-gallery]').forEach(initColorImageSync);
    initReviewForm();
    initReviewLightbox();
    initSizeGuide();
    initStickyBar();
  });

  window.addEventListener('resize', setHeaderHeight);

  // Re-init within the Shopify theme editor when sections are re-rendered.
  document.addEventListener('shopify:section:load', function (e) {
    var s = e.target;
    relabelNav();
    s.querySelectorAll('[data-before-after]').forEach(initBeforeAfter);
    s.querySelectorAll('[data-faq]').forEach(initFaq);
    s.querySelectorAll('[data-v-upsell]').forEach(initCartUpsell);
    if (s.matches && s.matches('.v-pdp')) initVariantPicker(s);
    s.querySelectorAll('.v-pdp').forEach(initVariantPicker);
    s.querySelectorAll('[data-gallery]').forEach(initGallery);
    s.querySelectorAll('[data-gallery]').forEach(initColorImageSync);
    initReviewForm(s);
    initReviewLightbox();
    initSizeGuide(s);
    initStickyBar();
  });
})();
