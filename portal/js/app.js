(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var frame = document.getElementById('content-frame');
  var welcome = document.getElementById('welcome');
  var homeLink = document.getElementById('home-link');
  var menuToggle = document.getElementById('menu-toggle');

  function goHome() {
    document.querySelectorAll('.nav-item').forEach(function (el) {
      el.classList.remove('active');
    });
    frame.classList.add('hidden');
    frame.src = '';
    welcome.classList.remove('hidden');
    history.replaceState(null, '', window.location.pathname);
  }

  homeLink.addEventListener('click', goHome);

  function renderNav() {
    nav.innerHTML = PROJECTS.map(function (p) {
      return '<div class="nav-item" data-id="' + p.id + '" data-url="' + p.url + '">' +
        '<span>' + p.icon + '</span>' + p.title +
      '</div>';
    }).join('');
  }

  function loadProject(item) {
    document.querySelectorAll('.nav-item').forEach(function (el) {
      el.classList.remove('active');
    });
    item.classList.add('active');
    welcome.classList.add('hidden');
    frame.classList.remove('hidden');
    frame.src = item.dataset.url;
    window.location.hash = item.dataset.id;
    nav.classList.remove('open');
  }

  function loadFromHash() {
    var hash = window.location.hash.replace('#', '');
    if (!hash) return;
    var item = nav.querySelector('.nav-item[data-id="' + hash + '"]');
    if (item) loadProject(item);
  }

  nav.addEventListener('click', function (e) {
    var item = e.target.closest('.nav-item');
    if (item) loadProject(item);
  });

  window.addEventListener('hashchange', loadFromHash);

  document.addEventListener('DOMContentLoaded', function () {
    renderNav();
    loadFromHash();
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      nav.classList.toggle('open');
    });
    document.addEventListener('click', function () {
      nav.classList.remove('open');
    });
  });
})();
