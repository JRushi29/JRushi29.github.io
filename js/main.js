// Rushikesh Jadhav — site interactions. No dependencies.
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  // Base path: "" at site root, "../" inside /editions/
  var me = document.currentScript || document.querySelector('script[src*="main.js"]');
  var src = me ? me.getAttribute('src') : '';
  var BASE = src.indexOf('../') === 0 ? '../' : (src.charAt(0) === '/' ? '/' : '');

  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function () {
    var page = document.body.getAttribute('data-page') || '';
    var sub = document.body.getAttribute('data-sub') || '';

    /* ---------- Active nav state ---------- */
    document.querySelectorAll('.nav-list [data-page]').forEach(function (el) {
      if (el.getAttribute('data-page') === page) {
        if (el.tagName === 'A') el.setAttribute('aria-current', 'page');
        else el.classList.add('is-current');
      }
    });
    if (sub) {
      var subLink = document.querySelector('.menu a[data-sub="' + sub + '"]');
      if (subLink) subLink.setAttribute('aria-current', 'page');
    }

    /* ---------- Sliding indicator ---------- */
    var list = document.querySelector('.nav-list');
    var ind = document.querySelector('.nav-indicator');
    function current() { return list && list.querySelector('[aria-current="page"], .is-current'); }
    function moveTo(el) {
      if (!ind || !el) { if (ind) ind.classList.remove('ready'); return; }
      var r = el.getBoundingClientRect(), lr = list.getBoundingClientRect();
      ind.style.width = r.width + 'px';
      ind.style.transform = 'translateX(' + (r.left - lr.left) + 'px)';
      ind.classList.add('ready');
    }
    if (list && ind) {
      var home = function () { moveTo(current()); };
      document.fonts && document.fonts.ready.then(home);
      home();
      list.querySelectorAll(':scope > li > a, :scope > li > .menu-btn').forEach(function (el) {
        el.addEventListener('mouseenter', function () { moveTo(el); });
        el.addEventListener('focus', function () { moveTo(el); });
      });
      list.addEventListener('mouseleave', home);
      window.addEventListener('resize', home);
    }

    /* ---------- Notebook dropdown ---------- */
    var menuBtn = document.querySelector('.menu-btn');
    var menu = document.getElementById('menu-notebook');
    function setMenu(open) {
      if (!menuBtn || !menu) return;
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.classList.toggle('open', open);
    }
    if (menuBtn && menu) {
      menuBtn.addEventListener('click', function (e) { e.stopPropagation(); setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
      var li = menuBtn.parentElement, t;
      li.addEventListener('mouseenter', function () { if (window.matchMedia('(hover: hover) and (min-width: 861px)').matches) { clearTimeout(t); setMenu(true); } });
      li.addEventListener('mouseleave', function () { if (window.matchMedia('(hover: hover) and (min-width: 861px)').matches) { t = setTimeout(function () { setMenu(false); }, 160); } });
      document.addEventListener('click', function (e) { if (!li.contains(e.target)) setMenu(false); });
    }

    /* ---------- Mobile nav ---------- */
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.main-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });
    }

    /* ---------- Theme toggle ---------- */
    var themeBtn = document.querySelector('.theme-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
      });
    }

    /* ---------- Reading progress ---------- */
    var bar = document.querySelector('.progress');
    if (bar) {
      var onScroll = function () {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* ---------- Command palette (Ctrl/⌘ K) ---------- */
    var ITEMS = [
      ['Pages', 'Journey', 'index.html', 'Home and the log'],
      ['Pages', 'Work: Dev & Research', 'dev-research.html', 'Projects and tools'],
      ['Pages', 'Weekly brief', 'brief.html', 'Water, climate & AI news'],
      ['Pages', 'Articles', 'articles.html', 'Notebook'],
      ['Pages', 'Writing & vlogs', 'writing.html', 'Notebook'],
      ['Pages', 'Hobbies', 'hobbies.html', 'Notebook'],
      ['Pages', 'About', 'about.html', 'Background and contact'],
      ['Projects', 'Headless HEC-HMS forecast pipeline', 'dev-research.html#hms', 'Automation'],
      ['Projects', 'Dam-break population-at-risk dashboard', 'dev-research.html#par', 'Dashboard'],
      ['Projects', 'GEE Scout', 'dev-research.html#gee', 'Dataset discovery'],
      ['Projects', 'Roadmap', 'dev-research.html#roadmap', 'Where the work is heading'],
      ['Projects', 'Toolkit', 'dev-research.html#stack', 'Models, code, delivery'],
      ['Elsewhere', 'GitHub', 'https://github.com/JRushi29', 'github.com/JRushi29']
    ];
    var cmdk = document.querySelector('.cmdk');
    if (cmdk) {
      var input = cmdk.querySelector('input');
      var ul = cmdk.querySelector('.cmdk-list');
      var sel = 0, shown = [];
      var href = function (u) { return /^https?:/.test(u) ? u : BASE + u; };
      var render = function () {
        var q = input.value.trim().toLowerCase();
        shown = ITEMS.filter(function (it) { return !q || (it[1] + ' ' + it[3] + ' ' + it[0]).toLowerCase().indexOf(q) > -1; });
        sel = Math.min(sel, Math.max(0, shown.length - 1));
        ul.innerHTML = '';
        if (!shown.length) { ul.innerHTML = '<li class="cmdk-empty">Nothing matches. Try “HEC”, “brief” or “about”.</li>'; return; }
        var group = '';
        shown.forEach(function (it, i) {
          if (it[0] !== group) { group = it[0]; var g = document.createElement('li'); g.className = 'cmdk-group'; g.textContent = group; ul.appendChild(g); }
          var li = document.createElement('li'), a = document.createElement('a');
          a.href = href(it[2]); a.id = 'cmdk-' + i;
          if (/^https?:/.test(it[2])) { a.target = '_blank'; a.rel = 'noopener'; }
          a.innerHTML = '<span></span><span class="h"></span>';
          a.firstChild.textContent = it[1]; a.lastChild.textContent = it[3];
          if (i === sel) { a.className = 'sel'; input.setAttribute('aria-activedescendant', a.id); }
          a.addEventListener('mousemove', function () { if (sel !== i) { sel = i; render(); } });
          a.addEventListener('click', function () { close(); });
          li.appendChild(a); ul.appendChild(li);
        });
        var s = ul.querySelector('.sel'); if (s) s.scrollIntoView({ block: 'nearest' });
      };
      var lastFocus;
      var open = function () { lastFocus = document.activeElement; cmdk.classList.add('open'); input.value = ''; sel = 0; render(); input.focus(); document.body.style.overflow = 'hidden'; };
      var close = function () { cmdk.classList.remove('open'); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); };
      document.querySelectorAll('.cmd-btn').forEach(function (b) { b.addEventListener('click', open); });
      cmdk.querySelector('.cmdk-backdrop').addEventListener('click', close);
      input.addEventListener('input', function () { sel = 0; render(); });
      document.addEventListener('keydown', function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); cmdk.classList.contains('open') ? close() : open(); return; }
        if (e.key === '/' && !cmdk.classList.contains('open') && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); open(); return; }
        if (!cmdk.classList.contains('open')) { if (e.key === 'Escape') setMenu(false); return; }
        if (e.key === 'Escape') { close(); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % shown.length; render(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + shown.length) % shown.length; render(); }
        else if (e.key === 'Enter') { var a = ul.querySelector('.sel'); if (a) { e.preventDefault(); a.click(); if (!a.target) window.location.href = a.href; } }
      });
      var mac = /Mac|iPhone|iPad/.test(navigator.platform);
      document.querySelectorAll('.cmd-btn kbd').forEach(function (k) { k.textContent = mac ? '⌘K' : 'Ctrl K'; });
    }

    /* ---------- Home feed filters ---------- */
    var filterButtons = document.querySelectorAll('.filters button');
    var entries = document.querySelectorAll('.log .entry');
    filterButtons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
        var cat = btn.getAttribute('data-filter');
        entries.forEach(function (entry) {
          entry.style.display = (cat === 'all' || entry.getAttribute('data-category') === cat) ? '' : 'none';
        });
      });
    });

    /* ---------- Sub-tabs (Hobbies) ---------- */
    var subtabButtons = document.querySelectorAll('.subtabs button');
    var subpanels = document.querySelectorAll('.subpanel');
    subtabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        subtabButtons.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        subpanels.forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');
        var target = document.getElementById(btn.getAttribute('data-tab'));
        if (target) target.classList.add('active');
      });
    });

    /* ---------- On-page TOC highlight (Work page) ---------- */
    var tocLinks = document.querySelectorAll('.toc a[href^="#"]');
    if (tocLinks.length && 'IntersectionObserver' in window) {
      var map = {};
      tocLinks.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) map[s.id] = a; });
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting && map[en.target.id]) { tocLinks.forEach(function (a) { a.classList.remove('active'); }); map[en.target.id].classList.add('active'); } });
      }, { rootMargin: '-40% 0px -55% 0px' });
      Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
    }

    /* ---------- Hydrograph path lengths ---------- */
    document.querySelectorAll('.hydro .flow, .hydro .base').forEach(function (p) {
      p.style.setProperty('--len', Math.ceil(p.getTotalLength()));
    });

    /* ---------- Weekly Brief: section filter ---------- */
    var secButtons = document.querySelectorAll('.sec-nav button');
    if (secButtons.length) {
      var paper = document.querySelector('.paper');
      var applySection = function (sec) {
        secButtons.forEach(function (b) {
          var on = b.getAttribute('data-section') === sec;
          b.classList.toggle('active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        paper.querySelectorAll('.item[data-section], .lead-story[data-section]').forEach(function (el) {
          el.classList.toggle('is-hidden', sec !== 'all' && el.getAttribute('data-section') !== sec);
        });
        var firstCol = true;
        paper.querySelectorAll('.desk-grid > section').forEach(function (col) {
          var hide = !col.querySelector('.item:not(.is-hidden)');
          col.classList.toggle('is-hidden', hide);
          col.classList.toggle('col-first', !hide && firstCol);
          if (!hide) firstCol = false;
        });
        var front = paper.querySelector('.front'), lead = paper.querySelector('.front .lead-story');
        if (front && lead) front.classList.toggle('no-lead', lead.classList.contains('is-hidden'));
        var arch = paper.querySelectorAll('#archive li[data-sections]'), shownArch = 0;
        arch.forEach(function (li) {
          var hit = sec === 'all' || (' ' + li.getAttribute('data-sections') + ' ').indexOf(' ' + sec + ' ') > -1;
          li.classList.toggle('is-hidden', !hit); if (hit) shownArch++;
        });
        var none = paper.querySelector('.archive-none');
        if (none) none.classList.toggle('is-hidden', sec === 'all' || shownArch > 0);
        var empty = paper.querySelector('#archive li.empty');
        if (empty) empty.classList.toggle('is-hidden', sec !== 'all');
      };
      secButtons.forEach(function (b) {
        b.addEventListener('click', function () {
          var sec = b.getAttribute('data-section');
          applySection(b.classList.contains('active') && sec !== 'all' ? 'all' : sec);
        });
      });
    }

    /* ---------- Footer year ---------- */
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  });
})();
