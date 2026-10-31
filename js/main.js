// Journey Log — small interactions, no dependencies.
document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Home feed category filters
  var filterButtons = document.querySelectorAll('.filters button');
  var entries = document.querySelectorAll('.log .entry');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-filter');
      entries.forEach(function (entry) {
        entry.style.display = (cat === 'all' || entry.getAttribute('data-category') === cat) ? '' : 'none';
      });
    });
  });

  // Sub-tabs (Hobbies: Travel / Reading / Opinions)
  var subtabButtons = document.querySelectorAll('.subtabs button');
  var subpanels = document.querySelectorAll('.subpanel');
  subtabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      subtabButtons.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      subpanels.forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      var target = document.getElementById(btn.getAttribute('data-tab'));
      if (target) target.classList.add('active');
    });
  });

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});
