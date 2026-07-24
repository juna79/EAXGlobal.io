/* ============================================================================
   EAX GLOBAL — motion engine (dependency-free)
   Calm, architectural motion that reinforces the trust-infrastructure story.
   - Respects prefers-reduced-motion (renders static end-states)
   - Pauses work offscreen and when the tab is hidden (60fps budget)
   - Every animation is keyed off a data-anim / data-scrub attribute so the
     illustration inside can be replaced later without touching page logic.
   ========================================================================== */
(function () {
  "use strict";

  var REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var css = getComputedStyle(document.documentElement);
  var C = {
    accent: (css.getPropertyValue("--accent") || "#5db665").trim(),
    accentDim: "rgba(93,182,101,0.55)",
    line: "rgba(233,231,225,0.10)",
    lineSoft: "rgba(233,231,225,0.05)",
    node: "rgba(233,231,225,0.55)",
    nodeDim: "rgba(233,231,225,0.22)",
    bg: (css.getPropertyValue("--bg") || "#0a0c0f").trim()
  };
  var rafActive = [];           // list of {tick, running}
  function raf(loop) {
    var state = { running: true };
    function frame(t) { if (!state.running) return; loop(t); requestAnimationFrame(frame); }
    requestAnimationFrame(frame);
    rafActive.push(state);
    return state;
  }
  document.addEventListener("visibilitychange", function () {
    // pausing is handled per-animation via IO; hidden tab simply lets rAF idle
  });

  /* Run init when element enters viewport; optionally stop when it leaves. */
  function whenVisible(el, onEnter, opts) {
    opts = opts || {};
    if (!("IntersectionObserver" in window)) { onEnter(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { onEnter(e); if (opts.once !== false) io.unobserve(el); }
      });
    }, { threshold: opts.threshold || 0.2, rootMargin: opts.rootMargin || "0px 0px -8% 0px" });
    io.observe(el);
  }

  /* Play/pause a looping animation based on visibility. */
  function loopWhileVisible(el, tick, drawStatic) {
    if (REDUCE) { drawStatic && drawStatic(); return; }
    var state = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !state) { state = raf(tick); }
        else if (!e.isIntersecting && state) { state.running = false; state = null; }
      });
    }, { threshold: 0.05 });
    io.observe(el);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden && state) { state.running = false; state = null; }
    });
  }

  var HiDPI = Math.min(window.devicePixelRatio || 1, 2);
  function fitCanvas(cv) {
    var r = cv.getBoundingClientRect();
    cv.width = Math.max(1, Math.round(r.width * HiDPI));
    cv.height = Math.max(1, Math.round(r.height * HiDPI));
    var ctx = cv.getContext("2d");
    ctx.setTransform(HiDPI, 0, 0, HiDPI, 0, 0);
    return { w: r.width, h: r.height, ctx: ctx };
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  /* ========================================================================
     1. HERO TRUST FIELD — a calm living network of connected organisations,
        with verification pulses travelling the edges.
     ==================================================================== */
  function initTrustField(host) {
    var cv = document.createElement("canvas");
    cv.setAttribute("aria-hidden", "true");
    host.appendChild(cv);
    var dim = fitCanvas(cv), W = dim.w, H = dim.h, ctx = dim.ctx;

    var N = W < 640 ? 10 : 16, nodes = [], pulses = [], rings = [];
    function seed() {
      nodes = [];
      for (var i = 0; i < N; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.14, vy: (Math.random() - 0.5) * 0.14,
          r: Math.random() < 0.22 ? 2.6 : 1.7,
          key: Math.random() < 0.22
        });
      }
    }
    seed();
    var LINK = Math.min(W, H) < 400 ? 150 : 190;

    function edgesOf(i) {
      var out = [];
      for (var j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        var d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d < LINK) out.push(j);
      }
      return out;
    }
    function spawnPulse() {
      var i = (Math.random() * nodes.length) | 0, e = edgesOf(i);
      if (!e.length) return;
      var j = e[(Math.random() * e.length) | 0];
      pulses.push({ a: i, b: j, t: 0, sp: 0.010 + Math.random() * 0.006 });
    }
    var lastSpawn = 0;

    function draw(ts) {
      ctx.clearRect(0, 0, W, H);
      var i, j;
      // drift
      for (i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }
      // edges
      ctx.lineWidth = 1;
      for (i = 0; i < nodes.length; i++) {
        for (j = i + 1; j < nodes.length; j++) {
          var d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < LINK) {
            var o = (1 - d / LINK) * 0.5;
            ctx.strokeStyle = "rgba(233,231,225," + (o * 0.34).toFixed(3) + ")";
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      // nodes
      for (i = 0; i < nodes.length; i++) {
        var m = nodes[i];
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, 6.283);
        ctx.fillStyle = m.key ? C.accentDim : C.nodeDim;
        ctx.fill();
      }
      // pulses
      if (ts - lastSpawn > 1400 && pulses.length < 4) { spawnPulse(); lastSpawn = ts; }
      for (i = pulses.length - 1; i >= 0; i--) {
        var p = pulses[i]; p.t += p.sp;
        var a = nodes[p.a], b = nodes[p.b];
        if (!a || !b) { pulses.splice(i, 1); continue; }
        var x = lerp(a.x, b.x, p.t), y = lerp(a.y, b.y, p.t);
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 6.283);
        ctx.fillStyle = C.accent; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 5.5, 0, 6.283);
        ctx.fillStyle = "rgba(93,182,101,0.14)"; ctx.fill();
        if (p.t >= 1) { rings.push({ x: b.x, y: b.y, t: 0 }); pulses.splice(i, 1); }
      }
      // verification rings
      for (i = rings.length - 1; i >= 0; i--) {
        var rg = rings[i]; rg.t += 0.03;
        var rad = 4 + rg.t * 26, al = (1 - rg.t) * 0.5;
        ctx.beginPath(); ctx.arc(rg.x, rg.y, rad, 0, 6.283);
        ctx.strokeStyle = "rgba(93,182,101," + al.toFixed(3) + ")";
        ctx.lineWidth = 1.2; ctx.stroke();
        if (rg.t >= 1) rings.splice(i, 1);
      }
    }

    if (REDUCE) { draw(0); return; }
    loopWhileVisible(host, function (t) { draw(t); }, function () { draw(0); });

    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        dim = fitCanvas(cv); W = dim.w; H = dim.h; ctx = dim.ctx;
        N = W < 640 ? 10 : 16; seed();
      }, 200);
    });
  }

  /* ========================================================================
     2. INTERACTIVE PRODUCT ECOSYSTEM — one EAX/Kweli core, product nodes
        orbiting it; edges draw outward on reveal; hover/focus highlights the
        relationship and updates the detail panel.
     ==================================================================== */
  function initEcosystem(root) {
    var svg = root.querySelector(".eco__svg");
    var nodesEls = Array.prototype.slice.call(root.querySelectorAll(".eco__node"));
    var edges = Array.prototype.slice.call(root.querySelectorAll(".eco__edge"));
    var detail = root.querySelector(".eco__detail");
    var titleEl = detail && detail.querySelector(".eco__d-title");
    var stageEl = detail && detail.querySelector(".eco__d-stage");
    var bodyEl = detail && detail.querySelector(".eco__d-body");

    // reveal: draw edges then pop nodes
    whenVisible(root, function () {
      root.classList.add("eco--in");
    }, { threshold: 0.3 });

    function select(el) {
      var key = el.getAttribute("data-key");
      nodesEls.forEach(function (n) { n.classList.toggle("is-active", n === el); });
      edges.forEach(function (e) { e.classList.toggle("is-active", e.getAttribute("data-key") === key); });
      if (detail) {
        titleEl.textContent = el.getAttribute("data-title");
        stageEl.textContent = el.getAttribute("data-stage");
        stageEl.className = "eco__d-stage " + (el.getAttribute("data-stageclass") || "");
        bodyEl.textContent = el.getAttribute("data-body");
        detail.classList.add("is-shown");
      }
    }
    function clearSel() {
      nodesEls.forEach(function (n) { n.classList.remove("is-active"); });
      edges.forEach(function (e) { e.classList.remove("is-active"); });
    }
    nodesEls.forEach(function (el) {
      el.addEventListener("mouseenter", function () { select(el); });
      el.addEventListener("focus", function () { select(el); });        // keyboard (Tab)
      el.addEventListener("click", function () { select(el); el.focus(); }); // tap / pointer
      el.addEventListener("mouseleave", clearSel);
      el.addEventListener("blur", clearSel);
    });
    // Keyboard: arrow keys move between products for convenience
    root.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var i = nodesEls.indexOf(document.activeElement);
      if (i === -1) return;
      e.preventDefault();
      var n = e.key === "ArrowRight" ? (i + 1) % nodesEls.length : (i - 1 + nodesEls.length) % nodesEls.length;
      nodesEls[n].focus();
    });
  }

  /* ========================================================================
     3. SCROLL SCRUBBER — maps an element's progress through the viewport to a
        0..1 value; drives "construct-as-you-scroll" pieces (ladder, vision).
     ==================================================================== */
  var scrubbers = [];
  function addScrubber(el, cb, mode) {
    scrubbers.push({ el: el, cb: cb, mode: mode || "through" });
  }
  function runScrubbers() {
    var vh = window.innerHeight;
    for (var i = 0; i < scrubbers.length; i++) {
      var s = scrubbers[i], r = s.el.getBoundingClientRect(), p;
      if (s.mode === "sticky") {
        // tall section with inner sticky; progress across the scroll distance
        var total = r.height - vh;
        p = clamp((-r.top) / (total || 1), 0, 1);
      } else {
        // element travels through viewport: 0 when top hits bottom, 1 when bottom passes ~top
        p = clamp((vh - r.top) / (vh + r.height * 0.6), 0, 1);
      }
      s.cb(p, r);
    }
  }

  /* 3a. Trust ladder — a vertical line constructs and stages light up. */
  function initLadder(root) {
    var path = root.querySelector(".ladder__line path");
    var steps = Array.prototype.slice.call(root.querySelectorAll(".ladder__step"));
    var len = path ? path.getTotalLength() : 0;
    if (path) { path.style.strokeDasharray = len; path.style.strokeDashoffset = len; }
    if (REDUCE) {
      if (path) path.style.strokeDashoffset = 0;
      steps.forEach(function (s) { s.classList.add("is-on"); });
      return;
    }
    addScrubber(root, function (p) {
      var pp = clamp((p - 0.08) / 0.72, 0, 1);
      if (path) path.style.strokeDashoffset = len * (1 - pp);
      steps.forEach(function (s, i) {
        var thr = (i + 0.5) / steps.length;
        s.classList.toggle("is-on", pp >= thr * 0.92);
      });
    });
  }

  /* 3b. Vision scene — sticky scrubbed scene: scattered systems resolve into
        an ordered trust stack as the trust-layer sweeps across. */
  function initVisionScene(root) {
    var scatter = Array.prototype.slice.call(root.querySelectorAll(".vs-scatter .vs-chip"));
    var sweep = root.querySelector(".vs-sweep");
    var stackItems = Array.prototype.slice.call(root.querySelectorAll(".vs-stack .vs-stack-item"));
    var caption = root.querySelectorAll(".vs-caption");
    // remember scattered start transforms
    scatter.forEach(function (c) {
      c.dataset.ox = c.getAttribute("data-ox"); c.dataset.oy = c.getAttribute("data-oy");
      c.dataset.rot = c.getAttribute("data-rot") || 0;
    });
    function apply(p) {
      // Phase A (0-0.4): scattered -> aligned column ; Phase B (0.4-1): stack rises
      var align = clamp(p / 0.42, 0, 1), ea = easeInOut(align);
      var fadeOut = 1 - clamp((p - 0.44) / 0.16, 0, 1); // dissolve inputs as the stack forms
      scatter.forEach(function (c, i) {
        var ox = parseFloat(c.dataset.ox), oy = parseFloat(c.dataset.oy), rot = parseFloat(c.dataset.rot);
        var tx = lerp(ox, 0, ea), ty = lerp(oy, (i - (scatter.length - 1) / 2) * 44, ea);
        var rr = lerp(rot, 0, ea);
        c.style.transform = "translate(" + tx + "px," + ty + "px) rotate(" + rr + "deg)";
        c.style.opacity = (lerp(0.4, 1, ea) * fadeOut).toFixed(3);
        c.style.borderColor = ea > 0.6 ? "var(--accent-line)" : "var(--line-2)";
      });
      if (sweep) {
        var sw = clamp((p - 0.30) / 0.20, 0, 1);
        sweep.style.opacity = sw;
        sweep.style.transform = "scaleX(" + easeInOut(sw) + ")";
      }
      var sp = clamp((p - 0.46) / 0.5, 0, 1);
      stackItems.forEach(function (it, i) {
        var thr = i / stackItems.length;
        var local = clamp((sp - thr) / (1 / stackItems.length), 0, 1), e = easeInOut(local);
        it.style.opacity = e;
        it.style.transform = "translateY(" + lerp(26, 0, e) + "px)";
      });
      if (caption.length) {
        caption[0].style.opacity = clamp(1 - p / 0.28, 0, 1);
        if (caption[1]) caption[1].style.opacity = clamp((p - 0.5) / 0.2, 0, 1);
      }
    }
    if (REDUCE) { apply(1); return; }
    apply(0);
    addScrubber(root, function (p) { apply(p); }, "sticky");
  }

  /* ========================================================================
     4. PRODUCT FLOW LOOPS — small looping SVG workflows (verify/claims/supply/
        marketplace). CSS drives most; JS only toggles the running class in view.
     ==================================================================== */
  function initFlow(el) {
    loopWhileVisible(el, function () {}, null); // CSS animations; ensure paused offscreen
    whenVisible(el, function () { el.classList.add("flow--run"); }, { threshold: 0.25, once: false, rootMargin: "0px" });
    if (REDUCE) el.classList.add("flow--static");
    // pause CSS anims when leaving
    if (!REDUCE && "IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { el.classList.toggle("flow--run", e.isIntersecting); });
      }, { threshold: 0.15 }).observe(el);
    }
  }

  /* ========================================================================
     5. TIMELINE — vertical progress line draws as the roadmap scrolls.
     ==================================================================== */
  function initTimeline(root) {
    var line = root.querySelector(".tl__progress");
    var dots = Array.prototype.slice.call(root.querySelectorAll(".tl__dot"));
    if (REDUCE) { if (line) line.style.height = "100%"; dots.forEach(function (d) { d.classList.add("is-on"); }); return; }
    addScrubber(root, function (p) {
      var pp = clamp((p - 0.05) / 0.7, 0, 1);
      if (line) line.style.transform = "scaleY(" + pp + ")";
      dots.forEach(function (d, i) {
        d.classList.toggle("is-on", pp >= (i + 0.5) / dots.length);
      });
    });
  }

  /* ========================================================================
     6. TYPING — insights coming-soon: a monospace line types rotating phrases.
     ==================================================================== */
  function initTyping(el) {
    var phrases = (el.getAttribute("data-phrases") || "").split("|").filter(Boolean);
    if (!phrases.length) return;
    var out = el.querySelector(".type__text");
    if (REDUCE) { out.textContent = phrases[0]; el.classList.add("type--static"); return; }
    var pi = 0, ci = 0, deleting = false;
    function step() {
      var word = phrases[pi];
      if (!deleting) {
        ci++; out.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; return setTimeout(step, 1900); }
      } else {
        ci--; out.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(step, deleting ? 34 : 58 + Math.random() * 40);
    }
    whenVisible(el, function () { setTimeout(step, 500); });
  }

  /* ========================================================================
     GLOBAL POLISH — reveal system (stagger + direction), nav scroll state,
     scroll progress bar.
     ==================================================================== */
  function initReveals() {
    var els = Array.prototype.slice.call(document.querySelectorAll(".reveal, [data-reveal]"));
    if (REDUCE || !("IntersectionObserver" in window)) {
      els.forEach(function (e) {
        e.classList.add("in");
        if (e.getAttribute("data-reveal") === "stagger") {
          for (var i = 0; i < e.children.length; i++) e.children[i].classList.add("in");
        }
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var group = el.getAttribute("data-reveal");
        if (group === "stagger") {
          var kids = el.children, i;
          for (i = 0; i < kids.length; i++) {
            (function (k, idx) { setTimeout(function () { k.classList.add("in"); }, idx * 80); })(kids[i], i);
          }
        }
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  function initNav() {
    var nav = document.querySelector(".nav");
    var bar = document.querySelector(".scroll-progress");
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      if (nav) nav.classList.toggle("is-scrolled", y > 8);
      if (bar) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = "scaleX(" + (h > 0 ? clamp(y / h, 0, 1) : 0) + ")";
      }
      runScrubbers();
    }
    window.addEventListener("scroll", function () {
      if (!onScroll._t) { onScroll._t = requestAnimationFrame(function () { onScroll._t = 0; onScroll(); }); }
    }, { passive: true });
    window.addEventListener("resize", function () { runScrubbers(); });
    onScroll();
  }

  /* ======================================================================== */
  function boot() {
    initReveals();
    initNav();
    document.querySelectorAll('[data-anim="trust-field"]').forEach(initTrustField);
    document.querySelectorAll('[data-anim="ecosystem"]').forEach(initEcosystem);
    document.querySelectorAll('[data-anim="ladder"]').forEach(initLadder);
    document.querySelectorAll('[data-anim="vision-scene"]').forEach(initVisionScene);
    document.querySelectorAll('[data-anim="timeline"]').forEach(initTimeline);
    document.querySelectorAll('[data-anim="typing"]').forEach(initTyping);
    document.querySelectorAll('[data-anim^="flow-"]').forEach(initFlow);
    runScrubbers();
    // gentle page-load entrance
    document.body.classList.add("loaded");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
