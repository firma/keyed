/**
 * Pretext AI Theme — Main Script
 * Deep integration with Pretext text layout engine
 *
 * Features:
 * 1. Hero canvas — particle text rendering via Pretext measurement
 * 2. Article title — Pretext-powered typography metrics
 * 3. Reading metrics — word count & time via Pretext segmentation
 * 4. Theme toggle — auto/dark/light with system preference sync
 * 5. Ambient particle background
 */

(function () {
  'use strict';

  // ─── Utility ───────────────────────────────────
  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return [].slice.call((ctx || document).querySelectorAll(s)); };
  var raf = requestAnimationFrame.bind(window);

  // ─── Theme Toggle ──────────────────────────────
  function initTheme() {
    var btn = $('#themeToggle');
    if (!btn) return;

    var html = document.documentElement;
    var stored = localStorage.getItem('pretext-theme');

    if (stored) {
      html.setAttribute('data-theme', stored);
    }

    btn.addEventListener('click', function () {
      var current = html.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('pretext-theme', next);
    });

    // System preference listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem('pretext-theme')) {
        html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
  }

  // ─── Mobile Menu ───────────────────────────────
  function initMobileMenu() {
    var btn = $('#mobileMenuBtn');
    var nav = $('.site-nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // ─── Pretext: Text Measurement Engine ──────────
  // Core text metrics using Canvas (Pretext's approach)
  var TextEngine = {
    _canvas: null,
    _ctx: null,

    init: function () {
      this._canvas = document.createElement('canvas');
      this._ctx = this._canvas.getContext('2d');
    },

    /**
     * Measure text precisely — Pretext's core philosophy:
     * one-time Canvas measurement, then pure math for layout.
     */
    measure: function (text, font, maxWidth) {
      var ctx = this._ctx;
      ctx.font = font;

      var words = this.segment(text);
      var lines = [];
      var currentLine = '';

      for (var i = 0; i < words.length; i++) {
        var testLine = currentLine ? currentLine + words[i] : words[i];
        var metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          lines.push({
            text: currentLine,
            width: ctx.measureText(currentLine).width
          });
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push({
          text: currentLine,
          width: ctx.measureText(currentLine).width
        });
      }

      return {
        lines: lines,
        totalHeight: lines.length * this.getLineHeight(font),
        charCount: text.length,
        wordCount: words.filter(function (w) { return w.trim().length > 0; }).length
      };
    },

    /**
     * Smart text segmentation — handles CJK, Latin, emoji.
     * Inspired by Pretext's i18n-aware segmentation.
     */
    segment: function (text) {
      var segments = [];
      var current = '';
      var CJK_RANGE = /[\u4e00-\u9fff\u3400-\u4dbf\u3000-\u303f\uff00-\uffef]/;

      for (var i = 0; i < text.length; i++) {
        var ch = text[i];
        if (CJK_RANGE.test(ch)) {
          if (current) { segments.push(current); current = ''; }
          segments.push(ch);
        } else if (ch === ' ' || ch === '\n') {
          current += ch;
          segments.push(current);
          current = '';
        } else {
          current += ch;
        }
      }
      if (current) segments.push(current);
      return segments;
    },

    getLineHeight: function (font) {
      var size = parseInt(font) || 16;
      return Math.round(size * 1.5);
    },

    /**
     * Calculate reading metrics — uses Pretext segmentation
     * for accurate CJK + Latin word counting.
     */
    readingMetrics: function (text) {
      var segments = this.segment(text);
      var CJK_RANGE = /[\u4e00-\u9fff\u3400-\u4dbf]/;
      var charCount = 0;
      var wordCount = 0;

      segments.forEach(function (seg) {
        seg = seg.trim();
        if (!seg) return;
        if (CJK_RANGE.test(seg)) {
          charCount += seg.length;
          wordCount += seg.length; // Each CJK char ≈ 1 word
        } else if (seg.length > 0) {
          charCount += seg.length;
          wordCount++;
        }
      });

      // ~300 CJK chars/min or ~200 English words/min
      var readTime = Math.max(1, Math.ceil(wordCount / 275));

      return {
        chars: charCount,
        words: wordCount,
        readTime: readTime
      };
    }
  };

  // ─── Hero Canvas Renderer ─────────────────────
  function initHeroCanvas() {
    var canvas = $('#hero-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouse = { x: -1000, y: -1000 };
    var heroEl = $('#hero');

    function resize() {
      var rect = heroEl.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initParticles();
    }

    function getColors() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      return {
        particle: isDark ? 'rgba(56,189,248,' : 'rgba(14,165,233,',
        line: isDark ? 'rgba(167,139,250,' : 'rgba(139,92,246,',
        glow: isDark ? '#38bdf8' : '#0ea5e9'
      };
    }

    function initParticles() {
      particles = [];
      var count = Math.min(80, Math.floor(canvas.width * canvas.height / 12000));
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.5 + 0.2
        });
      }
    }

    function drawFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var colors = getColors();
      var maxDist = 120;

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        // Mouse repulsion
        var dx = p.x - mouse.x;
        var dy = p.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          var force = (150 - dist) / 150 * 0.02;
          p.vx += dx * force;
          p.vy += dy * force;
        }

        // Damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = colors.particle + p.alpha + ')';
        ctx.fill();

        // Draw connections
        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var ddx = p.x - q.x;
          var ddy = p.y - q.y;
          var d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < maxDist) {
            var alpha = (1 - d / maxDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = colors.line + alpha + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      raf(drawFrame);
    }

    heroEl.addEventListener('mousemove', function (e) {
      var rect = heroEl.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroEl.addEventListener('mouseleave', function () {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    window.addEventListener('resize', resize);
    resize();
    drawFrame();
  }

  // ─── Reading Metrics (Post Page) ───────────────
  function initReadingMetrics() {
    var postBody = $('#postBody');
    var wordCountEl = $('#wordCount');
    var readTimeEl = $('#readTime');
    if (!postBody || !wordCountEl) return;

    var text = postBody.textContent || postBody.innerText;
    var metrics = TextEngine.readingMetrics(text);

    wordCountEl.textContent = metrics.words.toLocaleString() + ' words';
    if (readTimeEl) {
      readTimeEl.textContent = metrics.readTime + ' min read';
    }
  }

  // ─── Pretext Title Effects ─────────────────────
  function initTitleEffects() {
    var titles = $$('[data-pretext-title]');
    if (!titles.length) return;

    // Intersection observer for staggered reveal
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('pretext-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    titles.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ─── Brand Canvas (Header) ────────────────────
  function initBrandCanvas() {
    var canvas = $('#brand-canvas');
    var fallback = $('.brand-fallback');
    if (!canvas || !fallback) return;

    var ctx = canvas.getContext('2d');
    var text = fallback.textContent.trim();
    var dpr = window.devicePixelRatio || 1;

    // Use Pretext's approach: measure once, render to canvas
    var fontSize = 20;
    var font = '700 ' + fontSize + 'px Inter, "Noto Sans SC", sans-serif';

    TextEngine._ctx.font = font;
    var textWidth = TextEngine._ctx.measureText(text).width;

    canvas.width = (textWidth + 20) * dpr;
    canvas.height = 40 * dpr;
    canvas.style.width = (textWidth + 20) + 'px';
    canvas.style.height = '40px';
    ctx.scale(dpr, dpr);

    function render() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = font;

      // Gradient text
      var grad = ctx.createLinearGradient(0, 0, textWidth, 0);
      grad.addColorStop(0, isDark ? '#38bdf8' : '#0ea5e9');
      grad.addColorStop(0.5, isDark ? '#a78bfa' : '#8b5cf6');
      grad.addColorStop(1, isDark ? '#f472b6' : '#ec4899');

      ctx.fillStyle = grad;
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 0, 20);
    }

    render();
    fallback.style.opacity = '0';

    // Re-render on theme change
    var observer = new MutationObserver(function () { render(); });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  // ─── Ambient Background Particles ──────────────
  function initAmbientBg() {
    var bg = $('#pretext-bg');
    if (!bg) return;

    // CSS handles the ambient gradient — JS adds subtle floating dots
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    bg.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var dots = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      dots = [];
      var count = Math.floor(canvas.width * canvas.height / 40000);
      for (var i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.3,
          speed: Math.random() * 0.3 + 0.1,
          alpha: Math.random() * 0.3 + 0.05
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';

      dots.forEach(function (d) {
        d.y -= d.speed;
        if (d.y < -5) {
          d.y = canvas.height + 5;
          d.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? 'rgba(56,189,248,' + d.alpha + ')'
          : 'rgba(14,165,233,' + d.alpha * 0.5 + ')';
        ctx.fill();
      });
      raf(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
  }

  // ─── Header Scroll Shadow ──────────────────────
  function initHeaderScroll() {
    var header = $('.site-header');
    if (!header) return;
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        raf(function () {
          if (window.scrollY > 10) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ─── Initialize ────────────────────────────────
  function init() {
    TextEngine.init();
    initTheme();
    initMobileMenu();
    initHeaderScroll();
    initHeroCanvas();
    initBrandCanvas();
    initReadingMetrics();
    initTitleEffects();
    initAmbientBg();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
