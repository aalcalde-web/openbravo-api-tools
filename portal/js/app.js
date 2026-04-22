(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var frame = document.getElementById('content-frame');
  var welcome = document.getElementById('welcome');
  var homeLink = document.getElementById('home-link');

  function goHome() {
    document.querySelectorAll('.nav-item').forEach(function (el) {
      el.classList.remove('active');
    });
    frame.classList.add('hidden');
    frame.src = '';
    welcome.classList.remove('hidden');
  }

  homeLink.addEventListener('click', goHome);

  function renderNav() {
    nav.innerHTML = PROJECTS.map(function (p) {
      return '<div class="nav-item" data-url="' + p.url + '">' +
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
  }

  nav.addEventListener('click', function (e) {
    var item = e.target.closest('.nav-item');
    if (item) loadProject(item);
  });

  document.addEventListener('DOMContentLoaded', renderNav);
})();
