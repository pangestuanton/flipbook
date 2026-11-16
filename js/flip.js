/* ============================================================
   Flip engine: CSS 3D leaves, drag, tap zones, staggered goTo
   Two-page spread on desktop, single page on mobile.
   ============================================================ */
(function () {
  'use strict';

  var SINGLE_MQ = '(max-width: 900px)';

  function FlipBook(opts) {
    this.bookEl = opts.book;
    this.stackEl = opts.stack;
    this.faces = opts.faces;
    this.onFlip = opts.onFlip || function () {};
    this.onChange = opts.onChange || function () {};
    this.onSettle = opts.onSettle || function () {};

    this.mode = window.matchMedia(SINGLE_MQ).matches ? 'single' : 'double';
    this.desired = 0;          /* number of flipped leaves */
    this.leafEls = [];
    this._build();
    this._bind();
  }

  FlipBook.prototype.totalLeaves = function () {
    return this.mode === 'double' ? Math.ceil(this.faces.length / 2) : this.faces.length;
  };

  /* face index (1-based) currently considered "left/active" for progress */
  FlipBook.prototype.currentFace = function () {
    if (this.mode === 'single') return Math.min(this.desired + 1, this.faces.length);
    return this.desired === 0 ? 1 : Math.min(this.desired * 2, this.faces.length);
  };

  FlipBook.prototype._faceEl = function (faceIdx, side) {
    var face = this.faces[faceIdx - 1];
    var el = document.createElement('div');
    el.className = 'leaf__face leaf__face--' + side;
    el.setAttribute('aria-hidden', 'true');
    var inner = '';
    if (face.floats) {
      face.floats.forEach(function (f) {
        var p = f.split(':');
        inner += '<span class="floaty floaty--' + p[1] + '"><img src="img/' + p[0] + '.png" alt="" width="80" height="80" loading="lazy" aria-hidden="true"></span>';
      });
    }
    inner += '<div class="leaf__content" tabindex="0" aria-label="Isi halaman ' + faceIdx + '">' + face.html + '</div>';
    if (faceIdx > 1) {
      inner += '<span class="leaf__pagenum leaf__pagenum--' + side + '">' + faceIdx + '</span>';
    }
    inner += '<span class="leaf__shade leaf__shade--' + side + '"></span>';
    el.innerHTML = inner;
    el.dataset.face = faceIdx;
    return el;
  };

  FlipBook.prototype._build = function () {
    var self = this;
    this.bookEl.classList.toggle('book--single', this.mode === 'single');
    this.leafEls.forEach(function (leaf) { clearTimeout(leaf._timer); });
    this.stackEl.innerHTML = '';
    this.leafEls = [];
    var L = this.totalLeaves();

    for (var i = 0; i < L; i++) {
      var leaf = document.createElement('div');
      leaf.className = 'leaf';
      leaf.dataset.idx = i;

      var frontIdx, backIdx;
      if (this.mode === 'double') {
        frontIdx = i * 2 + 1;
        backIdx = i * 2 + 2;
      } else {
        frontIdx = i + 1;
        backIdx = null;
      }

      leaf.appendChild(this._faceEl(frontIdx, 'front'));
      if (backIdx && backIdx <= this.faces.length) {
        leaf.appendChild(this._faceEl(backIdx, 'back'));
      } else if (this.mode === 'double') {
        var blank = document.createElement('div');
        blank.className = 'leaf__face leaf__face--back';
        blank.innerHTML = '<div class="leaf__content"></div><span class="leaf__shade leaf__shade--back"></span>';
        leaf.appendChild(blank);
      }

      leaf._want = i < this.desired;
      this.stackEl.appendChild(leaf);
      this.leafEls.push(leaf);
    }

    this._normalizeZ();
    this._syncOffsets();
    /* restore flip states without animation (fresh build) */
    for (var j = 0; j < Math.min(this.desired, L); j++) {
      this.leafEls[j].classList.add('is-flipped', 'no-anim');
    }
    requestAnimationFrame(function () {
      self.leafEls.forEach(function (l) { l.classList.remove('no-anim'); });
    });
  };

  FlipBook.prototype.setMode = function (mode) {
    if (mode === this.mode) return;
    var face = this.currentFace();
    this.mode = mode;
    this.desired = mode === 'single' ? face - 1 : (face <= 1 ? 0 : Math.floor(face / 2));
    this._build();
    this.onChange();
  };

  FlipBook.prototype._normalizeZ = function () {
    var L = this.leafEls.length;
    if (this.mode === 'single') {
      for (var i = 0; i < L; i++) {
        var leaf = this.leafEls[i];
        if (i < this.desired) {
          leaf.style.zIndex = 10 + i;
        } else if (i === this.desired) {
          leaf.style.zIndex = 200;
        } else {
          leaf.style.zIndex = 100 + (L - i);
        }
      }
      return;
    }
    for (var i = 0; i < L; i++) {
      var z = this.leafEls[i]._want || this.leafEls[i].classList.contains('is-flipped')
        ? 100 + i
        : 100 + (L - i);
      this.leafEls[i].style.zIndex = z;
    }
  };

  FlipBook.prototype._syncOffsets = function () {
    var b = this.bookEl;
    var active = this.currentFace();
    var single = this.mode === 'single';
    this.stackEl.querySelectorAll('[data-face]').forEach(function (el) {
      var n = Number(el.dataset.face);
      var visible = single ? n === active : (active === 1 ? n === 1 : n === active || n === active + 1);
      el.setAttribute('aria-hidden', String(!visible));
      el.inert = !visible;
    });
    b.classList.toggle('book--closed', this.mode === 'double' && this.desired === 0);
    b.classList.toggle('book--end', this.mode === 'double' && this.desired >= this.totalLeaves());
  };

  /* apply flip state diffs toward this.desired, staggered */
  FlipBook.prototype._sync = function () {
    var self = this;
    var L = this.totalLeaves();
    var pending = [];
    for (var i = 0; i < L; i++) {
      var want = i < this.desired;
      var leaf = this.leafEls[i];
      if (leaf._want !== want) {
        leaf._want = want;
        pending.push(i);
      }
    }
    pending.forEach(function (idx, k) {
      var leaf = self.leafEls[idx];
      if (leaf._timer) clearTimeout(leaf._timer);
      leaf._timer = setTimeout(function () {
        leaf._timer = null;
        leaf.classList.toggle('is-flipped', leaf._want);
        leaf.style.zIndex = 300 + k;
        self.onFlip(leaf._want);
      }, k * 130);
    });
    if (pending.length === 0) this._settleCheck();
    this._syncOffsets();
    this.onChange();
  };

  FlipBook.prototype._settleCheck = function () {
    var busy = this.leafEls.some(function (l) { return l._timer; });
    if (!busy) this.onSettle();
  };

  FlipBook.prototype._onLeafTransitionEnd = function (leaf) {
    leaf.style.zIndex = '';
    leaf.classList.remove('is-flipping');
    this._normalizeZ();
    this._settleCheck();
  };

  FlipBook.prototype.next = function () {
    if (this.isAtEnd()) return false;
    this.desired++;
    this._sync();
    return true;
  };

  FlipBook.prototype.prev = function () {
    if (this.desired <= 0) return false;
    this.desired--;
    this._sync();
    return true;
  };

  FlipBook.prototype.goToFace = function (f) {
    if (!Number.isFinite(f)) return;
    f = Math.max(1, Math.min(this.faces.length, Math.floor(f)));
    var target = this.mode === 'single' ? f - 1 : (f <= 1 ? 0 : Math.floor(f / 2));
    if (target === this.desired) return;
    this.desired = target;
    this._sync();
  };

  FlipBook.prototype.isAtStart = function () { return this.desired === 0; };
  FlipBook.prototype.isAtEnd = function () { return this.desired >= (this.mode === 'single' ? this.faces.length - 1 : Math.floor(this.faces.length / 2)); };

  /* ---------------- pointer interaction ---------------- */
  FlipBook.prototype._bind = function () {
    var self = this;
    var stack = this.stackEl;

    /* corner buttons */
    this.cornerR = document.createElement('button');
    this.cornerR.className = 'corner corner--right';
    this.cornerR.setAttribute('aria-label', 'Balik ke halaman berikutnya');
    this.cornerR.innerHTML = window.icon('cornerR');
    this.cornerL = document.createElement('button');
    this.cornerL.className = 'corner corner--left';
    this.cornerL.setAttribute('aria-label', 'Balik ke halaman sebelumnya');
    this.cornerL.innerHTML = window.icon('cornerL');
    this.bookEl.appendChild(this.cornerR);
    this.bookEl.appendChild(this.cornerL);
    this.cornerR.addEventListener('click', function () { self.next(); });
    this.cornerL.addEventListener('click', function () { self.prev(); });

    /* transition end */
    stack.addEventListener('transitionend', function (e) {
      var leaf = e.target.closest('.leaf');
      if (leaf && e.propertyName === 'transform') self._onLeafTransitionEnd(leaf);
    });

    var gesture = null;
    var suppressClickUntil = 0;
    var controls = 'button, a, input, label, summary, select, textarea, .hotspot, [role="button"], [data-lightbox]';
    stack.style.touchAction = 'pan-y';
    stack.addEventListener('pointerdown', function (e) {
      if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0) || e.target.closest(controls)) return;
      gesture = { x: e.clientX, y: e.clientY, id: e.pointerId };
    });
    stack.addEventListener('pointermove', function (e) {
      if (!gesture || gesture.id !== e.pointerId) return;
      var dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
      if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) gesture = null;
    }, { passive: true });
    stack.addEventListener('pointerup', function (e) {
      if (!gesture || gesture.id !== e.pointerId) return;
      var dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
      gesture = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        suppressClickUntil = Date.now() + 400;
        if (dx < 0) self.next(); else self.prev();
      }
    });
    stack.addEventListener('pointercancel', function () { gesture = null; });
    stack.addEventListener('click', function (e) {
      if (Date.now() < suppressClickUntil || e.target.closest(controls)) return;
      var rect = self.bookEl.getBoundingClientRect();
      var position = (e.clientX - rect.left) / rect.width;
      if (position > 0.85) self.next();
      else if (position < 0.15) self.prev();
    });
  };

  FlipBook.prototype._recount = function () {
    var n = 0;
    this.leafEls.forEach(function (l) { if (l.classList.contains('is-flipped')) n++; });
    return n;
  };

  /* corner availability */
  FlipBook.prototype.updateCorners = function () {
    this.cornerR.classList.toggle('is-active', !this.isAtEnd());
    this.cornerR.disabled = this.isAtEnd();
    this.cornerL.classList.toggle('is-active', !this.isAtStart());
    this.cornerL.disabled = this.isAtStart();
  };

  window.FlipBook = FlipBook;
})();
