/* ============================================================
   App controller: boot, UI wiring, localStorage, quiz, overlays
   ============================================================ */
(function () {
  'use strict';

  var C = window.FB_CONTENT;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- state ---------- */
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem('flipbook.' + k); if (v === null) return d;
        v = JSON.parse(v);
        if (Array.isArray(d)) return Array.isArray(v) ? v.filter(function (n) { return Number.isInteger(n) && n >= 1 && n <= C.faces.length; }) : d;
        if (typeof v !== typeof d) return d;
        if (typeof d === 'number' && (!Number.isFinite(v) || v < 0 || v > C.faces.length)) return d;
        return v; }
      catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem('flipbook.' + k, JSON.stringify(v)); } catch (e) { /* private mode */ }
    }
  };

  var sound = { on: store.get('sound', false), ctx: null };

  function beep(kind) {
    if (!sound.on) return;
    try {
      sound.ctx = sound.ctx || new (window.AudioContext || window.webkitAudioContext)();
      var t = sound.ctx.currentTime;
      var o = sound.ctx.createOscillator();
      var g = sound.ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(kind === 'back' ? 300 : 420, t);
      o.frequency.exponentialRampToValueAtTime(kind === 'back' ? 220 : 560, t + 0.09);
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      o.connect(g).connect(sound.ctx.destination);
      o.start(t); o.stop(t + 0.13);
    } catch (e) { /* autoplay policy */ }
  }

  var toastTimer = null;
  function toast(msg) {
    var el = $('#toast');
    el.textContent = msg;
    el.classList.add('is-open');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-open'); }, 2200);
  }

  /* ---------- boot ---------- */
  var book, quiz, faceSeen = store.get('seen', []);
  var progressWrap = $('#progressWrap'), progressFill = $('#progressFill'), progressPct = $('#progressPct');
  var pageInput = $('#pageInput');
  var bookmarks = store.get('bookmarks', []);

  function init() {
    buildStaticUI();
    book = new window.FlipBook({
      book: $('#book'),
      stack: $('#leafstack'),
      faces: C.faces,
      onFlip: function () { beep('fwd'); },
      onChange: updateUI,
      onSettle: function () { markSeen(); }
    });
    var last = store.get('last', 1);
    if (last > 1) book.goToFace(last);
    window.__book = book; /* QA hook */
    buildToc($('#tocList'), false);
    updateUI();
    $('#app').hidden = false;
    wireGlobal();
    wireDialogs();
    $('#loader').classList.add('loader--done');
    setTimeout(function () { $('#loader').remove(); }, 600);
  }

  /* ---------- static UI ---------- */
  function buildStaticUI() {
    /* toolbar icons */
    $('#btnPrev').innerHTML = window.icon('chevL') + '<span class="tbtn__label">Mundur</span>';
    $('#btnNext').innerHTML = window.icon('chevR') + '<span class="tbtn__label">Lanjut</span>';
    $('#btnToc').innerHTML = window.icon('list') + '<span class="tbtn__label">Daftar Isi</span>';
    $('#btnMark').innerHTML = window.icon('bookmark') + '<span class="tbtn__label">Tanda</span>';
    $('#btnQuiz').innerHTML = window.icon('quiz') + '<span class="tbtn__label">Kuis</span>';
    $('#btnSound').innerHTML = window.icon('mute');
    $('#btnFull').innerHTML = window.icon('expand');
    /* drawer */
    $('#drawerClose').innerHTML = window.icon('close');
    $('#drawerBody').innerHTML =
      '<div class="toc" id="drawerToc"></div>' +
      '<div class="card card--peach" style="margin-top:14px"><h3>' + window.icon('bookmark') + 'Tanda halaman</h3><div class="check" id="bmList"></div></div>' +
      '<div class="card card--mint" style="margin-top:12px"><h3>' + window.icon('target') + 'Progres belajar</h3><div class="blist blist--num" id="progList"></div></div>';
    /* lightbox */
    $('#lbClose').innerHTML = window.icon('close');
    /* quiz center */
    $('#qcClose').innerHTML = window.icon('close');
    /* toast */
    document.body.insertAdjacentHTML('beforeend', '<div class="toast" id="toast" role="status" aria-live="polite"></div>');
  }

  function buildToc(container, drawerMode) {
    container.innerHTML = '';
    if (!container) return;
    C.toc.forEach(function (item) {
      var b = document.createElement('button');
      b.className = 'toc__item';
      b.dataset.face = item.face;
      b.innerHTML =
        '<span class="toc__num">' + item.face + '</span>' +
        '<span class="toc__name">' + item.name + '<span class="toc__desc">' + item.desc + '</span></span>' +
        '<span class="toc__page">hlm ' + item.face + '</span>';
      b.addEventListener('click', function () {
        book.goToFace(item.face);
        if (drawerMode) toggleDrawer(false);
      });
      container.appendChild(b);
    });
  }

  function buildBookmarks() {
    var wrap = $('#bmList');
    wrap.innerHTML = '';
    if (!bookmarks.length) {
      wrap.innerHTML = '<p class="small" style="margin:0">Belum ada tanda halaman. Tekan tombol Tanda untuk menyimpan halaman ini.</p>';
      return;
    }
    bookmarks.sort(function (a, b) { return a - b; }).forEach(function (f) {
      var face = C.faces[f - 1];
      var label = document.createElement('label');
      label.className = 'check__item';
      label.innerHTML =
        '<input type="checkbox" checked>' +
        '<span class="check__box">' + window.icon('check') + '</span>' +
        '<span class="check__text">hlm ' + f + ': ' + (face && face.id ? face.id : '') + '</span>';
      label.querySelector('input').addEventListener('change', function () {
        bookmarks = bookmarks.filter(function (x) { return x !== f; });
        store.set('bookmarks', bookmarks);
        buildBookmarks();
        updateUI();
      });
      wrap.appendChild(label);
    });
  }

  function buildProgressList() {
    var wrap = $('#progList');
    wrap.innerHTML = '';
    var total = C.faces.length;
    var done = faceSeen.length;
    wrap.innerHTML = '<li>' + done + ' dari ' + total + ' halaman sudah dibuka</li>' +
      '<li>Halaman terakhir: hlm ' + store.get('last', 1) + '</li>' +
      '<li>Skor kuis terbaik: ' + store.get('bestScore', 0) + ' dari ' + C.quiz.length + '</li>';
  }

  /* ---------- UI sync ---------- */
  function updateUI() {
    var f = book.currentFace();
    var pct = Math.round((f - 1) / (C.faces.length - 1) * 100);
    progressFill.style.width = pct + '%';
    progressWrap.setAttribute('aria-valuenow', pct);
    progressPct.textContent = pct + '%';
    pageInput.value = f;
    pageInput.max = C.faces.length;
    $('#btnPrev').disabled = book.isAtStart();
    $('#btnNext').disabled = book.isAtEnd();
    $('#btnMark').classList.toggle('tbtn--on', bookmarks.indexOf(f) !== -1);
    book.updateCorners();
    /* toc current (match either page of the visible spread) */
    $$('.toc__item').forEach(function (t) {
      var pf = parseInt(t.dataset.face, 10);
      t.classList.toggle('is-current', pf === f || (book.mode === 'double' && f > 1 && pf === f + 1));
    });
    /* lazy reveal + seen */
    $$('.leaf__face[aria-hidden="false"]', book.stackEl).forEach(function (faceEl) {
      revealIn(faceEl);
      $$('img[loading="lazy"]', faceEl).forEach(function (img) { img.loading = 'eager'; });
    });
    store.set('last', f);
    var hint = $('#closedHint');
    if (hint) hint.hidden = !(book.isAtStart() && book.mode === 'double');
  }

  function revealIn(scope) {
    $$('.rv', scope).forEach(function (el) {
      if (!el.classList.contains('is-in')) {
        setTimeout(function () { el.classList.add('is-in'); }, 40);
      }
    });
  }

  function markSeen() {
    var f = book.currentFace();
    if (faceSeen.indexOf(f) === -1) {
      faceSeen.push(f);
      store.set('seen', faceSeen);
    }
  }

  /* ---------- drawer / lightbox / quiz center ---------- */
  function toggleDrawer(open) {
    var d = $('#drawer'), s = $('#scrim');
    var willOpen = open === undefined ? !d.classList.contains('is-open') : open;
    d.classList.toggle('is-open', willOpen);
    s.classList.toggle('is-open', willOpen);
    document.body.classList.toggle('modal-open', willOpen);
    if (willOpen) { buildToc($('#drawerToc'), true); buildBookmarks(); buildProgressList(); }
  }

  function openLightbox(src, caption) {
    $('#lbImg').src = src;
    $('#lbImg').classList.remove('is-zoomed');
    $('#lbCap').textContent = caption || '';
    $('#lightbox').classList.add('is-open');
    document.body.classList.add('modal-open');
  }

  function closeLightbox() {
    $('#lightbox').classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }

  function wireDialogs() {
    var dialogs = [$('#drawer'), $('#quizcenter'), $('#lightbox')];
    var active = null, returnFocus = null;
    function sync() {
      var next = dialogs.filter(function (el) { return el.classList.contains('is-open'); }).pop() || null;
      if (next && !active) returnFocus = document.activeElement;
      dialogs.forEach(function (el) { el.inert = el !== next; el.setAttribute('aria-hidden', String(el !== next)); });
      $('#app').inert = !!next;
      document.body.classList.toggle('modal-open', !!next);
      $('#btnToc').setAttribute('aria-expanded', String(next === $('#drawer')));
      if (next !== active) {
        active = next;
        if (next) requestAnimationFrame(function () { if (active === next) next.querySelector('button').focus(); });
        else if (returnFocus && returnFocus.isConnected && !returnFocus.closest('[inert]')) returnFocus.focus();
      }
    }
    dialogs.forEach(function (el) { new MutationObserver(sync).observe(el, { attributes: true, attributeFilter: ['class'] }); });
    document.addEventListener('keydown', function (e) {
      if (!active || e.key !== 'Tab') return;
      var controls = $$('button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]', active).filter(function (el) { return el.getClientRects().length; });
      if (!controls.length) return;
      e.preventDefault();
      var index = controls.indexOf(document.activeElement);
      var nextIndex = e.shiftKey ? (index <= 0 ? controls.length - 1 : index - 1) : (index + 1) % controls.length;
      controls[nextIndex].focus();
    });
    sync();
  }

  /* ---------- quiz ---------- */
  function QuizCenter() {
    this.wrap = $('#qcBody');
    this.i = 0;
    this.score = 0;
    this.answers = [];
  }
  QuizCenter.prototype.open = function () {
    this.i = 0; this.score = 0; this.answers = [];
    $('#quizcenter').classList.add('is-open');
    document.body.classList.add('modal-open');
    this.render();
  };
  QuizCenter.prototype.close = function () {
    $('#quizcenter').classList.remove('is-open');
    document.body.classList.remove('modal-open');
  };
  QuizCenter.prototype.render = function () {
    var self = this;
    if (this.i >= C.quiz.length) return this.done();
    var q = C.quiz[this.i];
    var html = '<div class="quiz">' +
      '<div class="quiz__head"><span class="quiz__count">Soal ' + (this.i + 1) + ' dari ' + C.quiz.length + '</span>' +
      '<span class="quiz__count">Benar: ' + this.score + '</span></div>' +
      '<p class="quiz__q">' + q.q + '</p>' +
      '<div class="quiz__opts">' +
      q.opts.map(function (o, k) {
        return '<button class="quiz__opt" data-k="' + k + '"><span class="quiz__key">' + String.fromCharCode(65 + k) + '</span><span>' + o + '</span></button>';
      }).join('') +
      '</div><div class="quiz__fbwrap"></div></div>';
    this.wrap.innerHTML = html;
    $$('.quiz__opt', this.wrap).forEach(function (btn) {
      btn.addEventListener('click', function () { self.answer(parseInt(btn.dataset.k, 10), btn); });
    });
  };
  QuizCenter.prototype.answer = function (k, btn) {
    var self = this;
    var q = C.quiz[this.i];
    var ok = k === q.a;
    $$('.quiz__opt', this.wrap).forEach(function (b) { b.disabled = true; });
    var chosen = $('.quiz__opt[data-k="' + k + '"]', this.wrap);
    var correct = $('.quiz__opt[data-k="' + q.a + '"]', this.wrap);
    if (ok) {
      chosen.classList.add('is-correct');
      this.score++;
    } else {
      chosen.classList.add('is-wrong');
      correct.classList.add('is-correct');
    }
    var fb = $('.quiz__fbwrap', this.wrap);
    fb.innerHTML =
      '<div class="quiz__fb ' + (ok ? 'quiz__fb--ok' : 'quiz__fb--no') + '">' +
      '<strong>' + (ok ? 'Benar' : 'Belum tepat') + '</strong><span>' + q.fb + '</span></div>' +
      '<button class="tbtn tbtn--primary quiz__next">' + window.icon('arrowR') + '<span class="tbtn__label">' + (this.i + 1 < C.quiz.length ? 'Soal berikutnya' : 'Lihat hasil') + '</span></button>';
    $('.quiz__next', fb).addEventListener('click', function () { self.i++; self.render(); });
    if (ok) beep('fwd');
  };
  QuizCenter.prototype.done = function () {
    var self = this;
    var best = Math.max(store.get('bestScore', 0), this.score);
    store.set('bestScore', best);
    var art = this.score >= 8 ? 'a01' : this.score >= 5 ? 'a09' : 'a18';
    this.wrap.innerHTML =
      '<div class="quiz__done">' +
      '<img class="quiz__art" src="img/' + art + '.png" alt="" width="74" height="80">' +
      '<p class="quiz__score">' + this.score + '/' + C.quiz.length + '</p>' +
      '<p style="font-weight:700;color:var(--rose-ink)">' +
      (this.score >= 8 ? 'Hebat, pemahamanmu kuat.' : this.score >= 5 ? 'Bagus, ulangi bagian yang belum stabil.' : 'Ayo baca lagi modulnya, kamu pasti bisa.') +
      '</p>' +
      '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">' +
      '<button class="tbtn" id="qRetry">' + window.icon('refresh') + '<span class="tbtn__label">Ulangi</span></button>' +
      '<button class="tbtn tbtn--primary" id="qDone">' + window.icon('check') + '<span class="tbtn__label">Selesai</span></button>' +
      '</div></div>';
    $('#qRetry').addEventListener('click', function () { self.open(); });
    $('#qDone').addEventListener('click', function () { self.close(); });
  };

  /* ---------- global wiring ---------- */
  function wireGlobal() {
    $('#btnPrev').addEventListener('click', function () { book.prev(); });
    $('#btnNext').addEventListener('click', function () { book.next(); });
    $('#btnToc').addEventListener('click', function () { toggleDrawer(); });
    $('#scrim').addEventListener('click', function () { toggleDrawer(false); });
    $('#drawerClose').addEventListener('click', function () { toggleDrawer(false); });
    $('#btnMark').addEventListener('click', function () {
      var f = book.currentFace();
      if (bookmarks.indexOf(f) === -1) {
        bookmarks.push(f);
        toast('Tanda halaman disimpan di hlm ' + f);
      } else {
        bookmarks = bookmarks.filter(function (x) { return x !== f; });
        toast('Tanda halaman dihapus');
      }
      store.set('bookmarks', bookmarks);
      updateUI();
    });
    $('#btnQuiz').addEventListener('click', function () { quiz.open(); });
    $('#btnSound').addEventListener('click', function () {
      sound.on = !sound.on;
      store.set('sound', sound.on);
      $('#btnSound').innerHTML = window.icon(sound.on ? 'sound' : 'mute');
      toast(sound.on ? 'Suara halaman aktif' : 'Suara halaman mati');
    });
    $('#btnSound').innerHTML = window.icon(sound.on ? 'sound' : 'mute');
    $('#btnFull').addEventListener('click', function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () { toast('Layar penuh tidak tersedia.'); });
      else toast('Browser ini tidak mendukung layar penuh.');
    });
    document.addEventListener('fullscreenchange', function () {
      $('#btnFull').innerHTML = window.icon(document.fullscreenElement ? 'compress' : 'expand');
    });
    pageInput.addEventListener('change', function () {
      var v = parseInt(pageInput.value, 10);
      if (isNaN(v)) { pageInput.value = book.currentFace(); return; }
      book.goToFace(Math.max(1, Math.min(C.faces.length, v)));
    });
    $('#lbClose').addEventListener('click', closeLightbox);
    $('#lightbox').addEventListener('click', function (e) { if (e.target === $('#lightbox')) closeLightbox(); });
    $('#lbImg').addEventListener('click', function () { $('#lbImg').classList.toggle('is-zoomed'); });
    $('#qcClose').addEventListener('click', function () { quiz.close(); });
    $('#quizcenter').addEventListener('click', function (e) {
      if (e.target === $('#quizcenter')) quiz.close();
    });

    $('#closedHint').addEventListener('click', function () { book.next(); });
    /* keyboard */
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"]')) {
        e.preventDefault(); e.target.click(); return;
      }
      var open = document.body.classList.contains('modal-open');
      if (e.key === 'Escape') {
        if ($('#lightbox').classList.contains('is-open')) return closeLightbox();
        if ($('#quizcenter').classList.contains('is-open')) return quiz.close();
        if ($('#drawer').classList.contains('is-open')) return toggleDrawer(false);
        return;
      }
      if (open || e.target.closest('input, textarea, select, button, a, [contenteditable], .leaf__content')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); book.next(); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); book.prev(); }
      if (e.key === 'Home') { e.preventDefault(); book.goToFace(1); }
      if (e.key === 'End') { e.preventDefault(); book.goToFace(C.faces.length); }
    });

    /* delegated: TOC on page, quiz CTA, hotspots, lightbox triggers */
    document.addEventListener('click', function (e) {
      var t;
      if ((t = e.target.closest('#tocQuizBtn'))) { quiz.open(); return; }
      if ((t = e.target.closest('#tocResumeBtn'))) {
        var last = store.get('last', 1);
        book.goToFace(Math.max(2, last));
        toast('Lanjut ke hlm ' + Math.max(2, last));
        return;
      }
      if ((t = e.target.closest('#quizCtaBtn'))) { quiz.open(); return; }
      if ((t = e.target.closest('.hotspot'))) {
        var wasOpen = t.classList.contains('is-open');
        $$('.hotspot.is-open').forEach(function (h) { h.classList.remove('is-open'); h.setAttribute('aria-expanded', 'false'); });
        t.classList.toggle('is-open', !wasOpen);
        t.setAttribute('aria-expanded', String(!wasOpen));
        return;
      }
      if ((t = e.target.closest('[data-lightbox]'))) {
        openLightbox(t.getAttribute('data-lightbox'), t.getAttribute('data-caption'));
        return;
      }
      if ((t = e.target.closest('.pemantik-card'))) {
        var pressed = t.getAttribute('aria-pressed') === 'true';
        t.setAttribute('aria-pressed', String(!pressed));
        t.classList.toggle('is-picked', !pressed);
      }
    });

    /* responsive mode */
    var mq = window.matchMedia('(max-width: 900px)');
    var onMq = function () {
      book.setMode(mq.matches ? 'single' : 'double');
      buildToc($('#tocList'), false);
      updateUI();
      sizeBook();
    };
    if (mq.addEventListener) mq.addEventListener('change', onMq); else mq.addListener(onMq);

    /* subtle parallax on floaters while dragging */
    var stack = $('#leafstack');
    stack.addEventListener('pointermove', function (e) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      $$('.floaty', stack).forEach(function (f) {
        if (f.className.indexOf('floaty--e') !== -1) return; /* edge-bleed stickers stay flush */
        var r = f.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        f.style.transform = 'translate(' + (dx * 6).toFixed(1) + 'px, 0)';
      });
    }, { passive: true });

    /* resize book size vars */
    var rt = null;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(sizeBook, 120);
    });
    sizeBook();
    if (window.ResizeObserver) new ResizeObserver(sizeBook).observe($('#stage'));
    if (document.fonts) document.fonts.ready.then(sizeBook);
  }

  function sizeBook() {
    var stage = $('#stage');
    if (!stage) return;
    var r = stage.getBoundingClientRect();
    var style = getComputedStyle(stage);
    var availH = Math.max(100, r.height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom));
    var availW = Math.max(100, r.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight));
    var single = window.matchMedia('(max-width: 900px)').matches;
    var pw = Math.min(availW / (single ? 1 : 2), 460);
    // Short viewports keep a usable reading width; page contents scroll vertically.
    var ph = Math.min(availH, pw / (single ? 0.58 : 0.68));
    var root = document.documentElement.style;
    root.setProperty('--pw', Math.round(pw) + 'px');
    root.setProperty('--ph', Math.round(ph) + 'px');
  }

  /* ---------- boot sequence ---------- */
  var booted = false;
  function tryBoot() {
    if (booted) return;
    if (!window.FB_CONTENT || !window.FlipBook) return;
    booted = true;
    quiz = new QuizCenter();
    window.__quiz = quiz; /* QA hook */
    init();
  }
  tryBoot();
  /* if content script was blocked, retry shortly */
  setTimeout(tryBoot, 400);

  document.addEventListener('DOMContentLoaded', tryBoot);
})();
