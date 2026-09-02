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

  /* ---- Page load reveal ---------------------------------------------------
     .v-reveal blocks sit at opacity 0 until this class lands, so it must not
     wait for the load event: that fires only once every image, script and font
     is in — ~10s on a throttled phone — leaving the whole page blank meanwhile.
     DOM-ready is the right moment; the load listener stays as a safety net. */
  function markLoaded() { document.body.classList.add('is-loaded'); }
  if (document.readyState !== 'loading') markLoaded();
  else document.addEventListener('DOMContentLoaded', markLoaded);
  window.addEventListener('load', markLoaded);

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
     Wide screens: visible once the in-page ATC scrolls out of view.
     Single-column layout (<990px): the buy box sits under the photo, so the
     in-page button is far below the fold on open. There the bar rides along
     from the first paint and only steps aside while that button is actually
     on screen, so a shopper always has a buy button in reach.
     ======================================================================== */
  var stickyMq = null;
  var stickyMqHandler = null;

  function initStickyBar() {
    var bar = document.querySelector('[data-sticky-bar]');
    var anchor = document.querySelector('[data-atc-anchor]');
    if (!bar || !anchor || !('IntersectionObserver' in window)) return;
    var narrow = window.matchMedia('(max-width: 989px)');

    function apply(show) {
      // Measure once and reuse: reading offsetHeight straight after the class
      // write forced a synchronous layout on every scroll toggle.
      if (!bar._vHeight) bar._vHeight = bar.offsetHeight;
      bar.classList.toggle('is-visible', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
      bar.toggleAttribute('inert', !show);
      // Reserve space so the fixed bar never covers the footer/last CTA.
      document.body.style.paddingBottom = show ? bar._vHeight + 'px' : '';
    }

    function observe() {
      // Theme editor re-runs this on section reloads, and a resize past the
      // breakpoint re-arms it; drop the old observer either way.
      if (bar._vIo) bar._vIo.disconnect();
      var early = narrow.matches;
      // The block is taller than a phone screen once the bundle widget is in
      // it, so watch the button itself there — the block would hide the bar
      // while the real button was still below the fold.
      var target = anchor;
      if (early) target = document.querySelector('[data-atc-form] [name="add"]') || anchor;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          apply(early ? !e.isIntersecting : (!e.isIntersecting && e.boundingClientRect.top < 0));
        });
      }, early ? { threshold: 0 } : { threshold: 0, rootMargin: '0px 0px -100% 0px' });
      io.observe(target);
      bar._vIo = io;
    }

    observe();

    if (stickyMq && stickyMqHandler) {
      if (stickyMq.removeEventListener) stickyMq.removeEventListener('change', stickyMqHandler);
      else if (stickyMq.removeListener) stickyMq.removeListener(stickyMqHandler);
    }
    stickyMq = narrow;
    stickyMqHandler = observe;
    if (narrow.addEventListener) narrow.addEventListener('change', observe);
    else if (narrow.addListener) narrow.addListener(observe);   // older Safari
  }

  /* ========================================================================
     5. Product gallery thumbnails (PRD §2.0) — crossfade main image
     ======================================================================== */
  function initGallery(root) {
    var main = root.querySelector('[data-gallery-main]');
    var thumbs = Array.prototype.slice.call(root.querySelectorAll('[data-gallery-thumb]'));
    if (!main || !thumbs.length) return;

    function select(thumb) {
      var src = thumb.getAttribute('data-src');
      if (!src) return;
      // Mark active first: with repeated photos the src can already match, and
      // the active thumb still has to follow the swipe.
      thumbs.forEach(function (t) { t.classList.remove('is-active'); });
      thumb.classList.add('is-active');
      if (src === main.getAttribute('src')) return;
      main.style.opacity = '0';
      setTimeout(function () {
        // Drop the LCP srcset first — with it in place the browser keeps
        // painting the original candidate and ignores the new src.
        main.removeAttribute('srcset');
        main.removeAttribute('sizes');
        main.src = src;
        var alt = thumb.getAttribute('data-alt');
        if (alt) main.alt = alt;
        // Wait for the new image to decode so the fade-in never shows a blank frame.
        var show = function () { main.style.opacity = '1'; };
        if (main.decode) main.decode().then(show, show);
        else if (main.complete) show();
        else main.onload = show;
      }, 150);
    }

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () { select(thumb); });
    });

    /* Touch: swipe the main photo left/right to step through the gallery, so
       phone shoppers aren't forced to hit the small thumbnails. Nothing is
       preventDefault-ed and the listeners are passive, so vertical page
       scrolling stays native — a swipe only counts when it is clearly
       horizontal and long enough not to be a tap. */
    var stage = main.parentNode || main;
    var x0 = 0, y0 = 0, tracking = false;

    stage.addEventListener('touchstart', function (e) {
      tracking = e.touches.length === 1;
      if (!tracking) return;
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    }, { passive: true });

    stage.addEventListener('touchend', function (e) {
      if (!tracking) return;
      tracking = false;
      var t = e.changedTouches[0];
      var dx = t.clientX - x0;
      var dy = t.clientY - y0;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      var current = 0;
      thumbs.forEach(function (th, i) { if (th.classList.contains('is-active')) current = i; });
      var next = current + (dx < 0 ? 1 : -1);
      if (next < 0 || next >= thumbs.length) return;   // no wrap: the ends feel like ends
      select(thumbs[next]);
      // Keep the thumbnail strip in sync; block:'nearest' so the page itself
      // never jumps vertically.
      if (thumbs[next].scrollIntoView) {
        thumbs[next].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }, { passive: true });
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
  /* The sticky button scrolls to the bundle widget instead of adding straight
     to cart: size and colour are picked in Kaching's tiers, so an instant add
     would send a default variant. Falls back to the buy box if the app widget
     has not rendered. */
  function initStickyAtc() {
    document.querySelectorAll('[data-sticky-atc]').forEach(function (btn) {
      if (btn._vStickyAtc) return;
      btn._vStickyAtc = true;
      btn.addEventListener('click', function () {
        var target =
          document.querySelector('kaching-bundle-deals, kaching-bundle, .kaching-bundles__block') ||
          document.querySelector('[data-atc-anchor]') ||
          document.querySelector('#v-buybox');
        if (!target) return;
        var header = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - header - 12;
        window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
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

  /* ---- Cart upsell variant picker ----------------------------------------
     The drawer/cart upsell (Bloom Shorts) has colour + size options. Match the
     selected option values to a variant and feed its id into the add-to-cart
     form. Delegated on document so it survives Dawn re-rendering the drawer. */
  function syncUpsellPicker(picker, swapImage) {
    var dataEl = picker.querySelector('[data-upsell-variants]');
    var idInput = picker.parentNode
      ? picker.parentNode.querySelector('[data-upsell-variant-id]')
      : null;
    if (!idInput) {
      // Fall back to searching the enclosing card.
      var card = picker.closest('.v-drawer-upsell__card') || picker.closest('.v-drawer-upsell');
      if (card) idInput = card.querySelector('[data-upsell-variant-id]');
    }
    if (!dataEl || !idInput) return;
    var variants;
    try { variants = JSON.parse(dataEl.textContent); } catch (e) { return; }
    var chosen = Array.prototype.map.call(
      picker.querySelectorAll('[data-upsell-option]'),
      function (sel) { return sel.value; }
    );
    var match = variants.find(function (v) {
      return v.options.length === chosen.length && v.options.every(function (o, i) {
        return String(o) === String(chosen[i]);
      });
    });
    var scope = picker.closest('.v-drawer-upsell__card, .v-drawer-upsell, .v-cart-upsell__action, .v-cart-upsell__card') || picker.parentNode;
    var btn = scope ? scope.querySelector('button[name="add"], button[type="submit"]') : null;
    if (match) {
      idInput.value = match.id;
      // Swap the thumbnail to the chosen variant's image so the shopper sees
      // the colour they picked — only on an actual selection, so the default
      // stays the product's first image until they choose a colour. Fall back
      // to another variant sharing the same colour when this exact size has no
      // image of its own.
      if (swapImage) {
      var img = (picker.closest('.v-drawer-upsell__card, .v-cart-upsell__card') || document)
        .querySelector('[data-upsell-image]');
      var newSrc = match.image;
      if (!newSrc) {
        var sameColour = variants.find(function (v) {
          return v.image && String(v.options[0]) === String(match.options[0]);
        });
        if (sameColour) newSrc = sameColour.image;
      }
      if (img && newSrc && img.getAttribute('src') !== newSrc) {
        img.style.transition = 'opacity 0.15s ease';
        img.style.opacity = '0';
        setTimeout(function () {
          img.removeAttribute('srcset');
          img.removeAttribute('sizes');
          img.src = newSrc;
          var show = function () { img.style.opacity = '1'; };
          if (img.decode) img.decode().then(show, show);
          else if (img.complete) show();
          else img.onload = show;
        }, 150);
      }
      }
      if (btn) {
        btn.disabled = !match.available;
        var lbl = btn.querySelector('span:first-child');
        if (lbl && !btn._vDefaultLbl) btn._vDefaultLbl = lbl.innerHTML;
        if (lbl) lbl.innerHTML = match.available ? btn._vDefaultLbl : 'Sold Out';
      }
    } else if (btn) {
      btn.disabled = true;
    }
  }

  document.addEventListener('change', function (e) {
    var sel = e.target.closest && e.target.closest('[data-upsell-option]');
    if (!sel) return;
    var picker = sel.closest('[data-upsell-picker]');
    if (picker) syncUpsellPicker(picker, true);
  });

  function initUpsellPicker(root) {
    (root || document).querySelectorAll('[data-upsell-picker]').forEach(function (p) {
      // Keep the product's first image as the default thumbnail (sets the
      // variant id only). The photo swaps to a colour once the shopper picks
      // one — see the change handler above.
      syncUpsellPicker(p, false);
    });
  }

  /* ---- Autoplay videos on mobile -----------------------------------------
     iOS/Android often ignore the autoplay attribute until JS forces a muted
     play — and only reliably while the video is on screen. Set muted +
     playsinline as properties and play/pause via IntersectionObserver.
     Playback starts on scroll-in, never at load: kicking every clip off up
     front pulled megabytes of video against the product photo's bandwidth. */
  function initAutoplayVideos(root) {
    var vids = (root || document).querySelectorAll('.v-vsplit__video, .v-fsplit__video, video[autoplay]');
    if (!vids.length) return;
    var tryPlay = function (v) {
      v.muted = true;
      v.defaultMuted = true;
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      var p = v.play();
      if (p && p.catch) p.catch(function () { /* blocked (e.g. Low Power Mode) — ignore */ });
    };
    vids.forEach(function (v) {
      if (v._vAutoplay) return;
      v._vAutoplay = true;
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            v._vInView = en.isIntersecting;
            if (en.isIntersecting) tryPlay(v);
            else if (!v.paused) v.pause();
          });
        }, { threshold: 0.25 });
        io.observe(v);
      } else {
        v._vInView = true;
        tryPlay(v);
      }
      // Retry on first touch, which satisfies stricter autoplay policies — but
      // only for a clip already on screen, so a tap never pulls the others in.
      document.addEventListener('touchstart', function once() {
        if (v._vInView) tryPlay(v);
        document.removeEventListener('touchstart', once);
      }, { passive: true });
    });
  }

  /* ---- Offer countdown ----------------------------------------------------
     Drives the clock in every [data-v-countdown] pill. The PDP offer banner
     prints one for mobile and one for desktop, so each copy runs its own tick
     but they resolve to the same instant. Three modes: 'midnight' (end of the
     visitor's day, rolls over on its own), 'date' (a fixed end stamp) and
     'rolling' (an evergreen per-visitor window kept in localStorage). */
  function initCountdown(root) {
    var timers = (root || document).querySelectorAll('[data-v-countdown]');
    if (!timers.length) return;
    timers.forEach(function (el) {
      if (el._vCountdown) return;
      el._vCountdown = true;
      var clock = el.querySelector('[data-v-countdown-clock]');
      if (!clock) return;

      var mode = el.getAttribute('data-mode') || 'midnight';
      var hours = parseFloat(el.getAttribute('data-hours')) || 12;
      var expired = el.getAttribute('data-expired') || '';
      var store = 'v-countdown-' + (el.getAttribute('data-key') || 'default') + '-' + hours;

      function deadline() {
        if (mode === 'date') {
          var t = Date.parse((el.getAttribute('data-end') || '').trim().replace(' ', 'T'));
          return isNaN(t) ? 0 : t;
        }
        if (mode === 'rolling') {
          var saved = 0;
          try { saved = parseInt(localStorage.getItem(store), 10) || 0; } catch (e) {}
          var left = saved - Date.now();
          if (left <= 0 || left > hours * 3600000) {
            saved = Date.now() + hours * 3600000;
            try { localStorage.setItem(store, String(saved)); } catch (e) {}
          }
          return saved;
        }
        var midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        return midnight.getTime();
      }

      function pad(n) { return n < 10 ? '0' + n : String(n); }

      function stop() {
        if (expired) {
          clock.textContent = expired;
        } else {
          el.hidden = true;
        }
        clearInterval(el._vTick);
      }

      var end = deadline();
      function tick() {
        var left = end - Date.now();
        if (left <= 0) {
          if (mode === 'date') return stop();
          end = deadline();               // midnight / rolling start the next window
          left = Math.max(end - Date.now(), 0);
        }
        var secs = Math.floor(left / 1000);
        var days = Math.floor(secs / 86400);
        var out =
          pad(Math.floor((secs % 86400) / 3600)) + ':' +
          pad(Math.floor((secs % 3600) / 60)) + ':' +
          pad(secs % 60);
        clock.textContent = days > 0 ? days + 'd ' + out : out;
      }

      el._vTick = setInterval(tick, 1000);
      tick();
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
    initUpsellPicker();
    initAutoplayVideos();
    initStickyBar();
    initCountdown();
  });

  var headerTick = null;
  window.addEventListener('resize', function () {
    if (headerTick) return;
    headerTick = requestAnimationFrame(function () {
      headerTick = null;
      var bar = document.querySelector('[data-sticky-bar]');
      if (bar) bar._vHeight = 0;   // width change can rewrap the bar
      setHeaderHeight();
    });
  });

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
    initAutoplayVideos(s);
    initStickyBar();
    initCountdown(s);
  });
})();
