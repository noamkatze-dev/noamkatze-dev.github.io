// All client-side behaviour for the site. Vanilla JS, no libraries.
// Everything is progressive: if this file fails to load, all content is still visible.

(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: hairline after scrolling + reading progress ---------- */
  var header = document.querySelector('.site-header');
  var bar = document.querySelector('.progress-bar');
  function onScroll() {
    var y = window.scrollY || 0;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (bar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      bar.style.transform = 'scaleX(' + p + ')';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Scroll reveal (once; only for content below the fold) ---------- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var selector = '.projects > li, .home-section, .cs-section > .cs-text, .flow-item, .screens, .pairs, .persona, .process, .cta, .side-media, .cs-intro-media, .decision, .stats, .next, .about-block';
    var items = Array.prototype.slice.call(document.querySelectorAll(selector));
    var below = items.filter(function (el) {
      return el.getBoundingClientRect().top > window.innerHeight * 0.95;
    });
    below.forEach(function (el) {
      el.classList.add('reveal');
    });
    var io = new IntersectionObserver(
      function (entries) {
        var shown = 0;
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.style.transitionDelay = shown * 60 + 'ms';
          shown += 1;
          el.classList.add('is-in');
          io.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    below.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- Videos: silent, no browser controls ---------- */
  // Every video is muted and has no sound track. Videos marked data-autoplay
  // play while on screen (unless the visitor prefers reduced motion).
  // Clicking a video, or its play button, pauses or plays it.
  var videoBoxes = Array.prototype.slice.call(document.querySelectorAll('.video'));
  function syncState(box, v) {
    box.classList.toggle('is-paused', v.paused);
  }
  videoBoxes.forEach(function (box) {
    var v = box.querySelector('video');
    var btn = box.querySelector('.video-toggle');
    if (!v) return;
    v.muted = true;
    v.removeAttribute('controls');
    function toggle() {
      if (v.paused) {
        if (v.preload !== 'auto') v.preload = 'auto';
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        v.pause();
      }
    }
    if (btn) btn.addEventListener('click', toggle);
    v.addEventListener('play', function () { syncState(box, v); });
    v.addEventListener('pause', function () { syncState(box, v); });
  });

  var autoVideos = Array.prototype.slice.call(document.querySelectorAll('video[data-autoplay]'));
  if (autoVideos.length && !reduceMotion && 'IntersectionObserver' in window) {
    var vio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          if (entry.isIntersecting) {
            if (v.dataset.userPaused === '1') return;
            if (v.preload !== 'auto') v.preload = 'auto';
            var p = v.play();
            if (p && p.catch) p.catch(function () {});
          } else if (!v.paused) {
            v.pause();
          }
        });
      },
      { rootMargin: '150px 0px', threshold: 0.25 }
    );
    autoVideos.forEach(function (v) {
      var btn = v.parentNode.querySelector('.video-toggle');
      if (btn) {
        btn.addEventListener('click', function () {
          // Remember a deliberate pause so scrolling doesn't restart it
          v.dataset.userPaused = v.paused ? '1' : '0';
        });
      }
      vio.observe(v);
    });
  }

  /* ---------- Lightbox (native <dialog>) ---------- */
  var dialog = document.querySelector('.lightbox');
  var lbImg = dialog ? dialog.querySelector('.lightbox-img') : null;
  var lbCaption = dialog ? dialog.querySelector('.lightbox-caption') : null;
  var lbClose = dialog ? dialog.querySelector('.lightbox-close') : null;
  var opener = null;

  if (dialog && typeof dialog.showModal === 'function') {
    document.addEventListener('click', function (e) {
      var target = e.target;
      var btn = target && target.closest ? target.closest('button.zoom') : null;
      if (!btn) return;
      var inner = btn.querySelector('img');
      var figure = btn.closest('figure');
      var caption = figure ? figure.querySelector('figcaption') : null;
      opener = btn;
      lbImg.src = btn.getAttribute('data-full') || (inner ? inner.currentSrc || inner.src : '');
      lbImg.alt = inner ? inner.alt : '';
      lbCaption.textContent = caption ? caption.textContent.trim() : '';
      lbCaption.hidden = !lbCaption.textContent;
      dialog.showModal();
      if (lbClose) lbClose.focus();
    });

    if (lbClose) {
      lbClose.addEventListener('click', function () {
        dialog.close();
      });
    }
    // Click on the dark overlay (outside the image) closes it.
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', function () {
      lbImg.src = 'data:,';
      if (opener) opener.focus();
      opener = null;
    });
  } else {
    // Very old browsers: open the full image in the same tab instead.
    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('button.zoom') : null;
      if (btn && btn.getAttribute('data-full')) window.location.href = btn.getAttribute('data-full');
    });
  }

  /* ---------- Click-to-load embeds ---------- */
  document.querySelectorAll('[data-embed-load]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var frame = btn.closest('[data-embed-src]');
      var src = frame ? frame.getAttribute('data-embed-src') : '';
      if (!frame || !src) return;
      var iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.title = frame.getAttribute('data-embed-title') || 'Embedded content';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.replaceChildren(iframe);
      iframe.focus();
    });
  });
})();
