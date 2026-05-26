(function () {
  'use strict';

  var SERVERS = {
    undocumented: 'http://localhost:8889',
    description: 'http://localhost:8890'
  };

  // Pages
  var pageHome = document.getElementById('page-home');
  var pageTools = document.getElementById('page-tools');
  var frame = document.getElementById('content-frame');

  // Nav
  var navHome = document.getElementById('nav-home');
  var navTools = document.getElementById('nav-tools');

  // Tools DOM
  var catSelect = document.getElementById('cat-select');
  var apiSelect = document.getElementById('api-select');
  var apiInfo = document.getElementById('api-info');
  var infoName = document.getElementById('info-name');
  var infoModule = document.getElementById('info-module');
  var infoTags = document.getElementById('info-tags');
  var btnRun = document.getElementById('btn-run');
  var resultsSection = document.getElementById('results-section');
  var resultsHeader = document.getElementById('results-header');
  var statusEl = document.getElementById('status');
  var statusText = document.getElementById('status-text');
  var resultsEl = document.getElementById('results');
  var statsEl = document.getElementById('stats');
  var btnDownload = document.getElementById('btn-download');
  var btnClear = document.getElementById('btn-clear');
  var errorEl = document.getElementById('error');

  var allApis = [];
  var grouped = {};
  var lastCsv = '';
  var lastFilename = '';

  // --- Navigation ---
  function showPage(page) {
    pageHome.classList.add('hidden');
    pageTools.classList.add('hidden');
    frame.classList.add('hidden');
    frame.src = '';
    page.classList.remove('hidden');
    // Update nav active
    document.querySelectorAll('.nav-item').forEach(function (el) { el.classList.remove('active'); });
    if (page === pageTools) navTools.classList.add('active');
  }

  navHome.addEventListener('click', function (e) {
    e.preventDefault();
    showPage(pageHome);
  });

  navTools.addEventListener('click', function (e) {
    e.preventDefault();
    showPage(pageTools);
  });

  // Static nav items (iframe)
  document.querySelectorAll('.nav-item[data-nav]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      pageHome.classList.add('hidden');
      pageTools.classList.add('hidden');
      frame.classList.remove('hidden');
      frame.src = link.href;
      document.querySelectorAll('.nav-item').forEach(function (el) { el.classList.remove('active'); });
      link.classList.add('active');
    });
  });

  // Home cards navigation
  document.querySelectorAll('.home-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var target = card.getAttribute('data-goto');
      if (target === 'nav-tools') {
        showPage(pageTools);
      } else if (target === 'nav-field-ref') {
        document.querySelectorAll('.nav-item[data-nav]')[0].click();
      } else if (target === 'nav-undoc') {
        document.querySelectorAll('.nav-item[data-nav]')[1].click();
      } else if (target === 'nav-converter') {
        document.querySelectorAll('.nav-item[data-nav]')[2].click();
      }
    });
  });

  // --- Tool cards ---
  document.querySelectorAll('.tool-card').forEach(function (card) {
    card.addEventListener('click', function () {
      document.querySelectorAll('.tool-card').forEach(function (c) { c.classList.remove('selected'); });
      card.classList.add('selected');
      checkReady();
    });
  });

  // --- Load APIs (from static data) ---
  function loadApis() {
    if (typeof API_DATA !== 'undefined' && API_DATA.length > 0) {
      allApis = API_DATA;
      groupApis();
      renderCategories();
    } else {
      catSelect.innerHTML = '<option value="">⚠️ No hay datos de APIs</option>';
    }
  }

  function groupApis() {
    grouped = {};
    allApis.forEach(function (a) {
      var cat = a.category || 'Other';
      if (!grouped[cat]) grouped[cat] = { icon: a.categoryIcon || '📄', apis: [] };
      grouped[cat].apis.push(a);
    });
  }

  function renderCategories() {
    var html = '<option value="">— Selecciona —</option>';
    var keys = Object.keys(grouped);
    for (var i = 0; i < keys.length; i++) {
      var g = grouped[keys[i]];
      html += '<option value="' + keys[i] + '">' + g.icon + ' ' + keys[i] + ' (' + g.apis.length + ')</option>';
    }
    catSelect.innerHTML = html;
  }

  catSelect.addEventListener('change', function () {
    var cat = catSelect.value;
    apiInfo.classList.add('hidden');
    resultsSection.classList.add('hidden');
    if (!cat || !grouped[cat]) {
      apiSelect.innerHTML = '<option value="">— Selecciona categoría —</option>';
      apiSelect.disabled = true;
      checkReady();
      return;
    }
    var apis = grouped[cat].apis;
    var html = '<option value="">— Selecciona API —</option>';
    for (var i = 0; i < apis.length; i++) {
      html += '<option value="' + apis[i].key + '">' + apis[i].label + '</option>';
    }
    apiSelect.innerHTML = html;
    apiSelect.disabled = false;
    checkReady();
  });

  apiSelect.addEventListener('change', function () {
    var key = apiSelect.value;
    resultsSection.classList.add('hidden');
    if (!key) {
      apiInfo.classList.add('hidden');
      checkReady();
      return;
    }
    var api = null;
    for (var i = 0; i < allApis.length; i++) {
      if (allApis[i].key === key) { api = allApis[i]; break; }
    }
    if (!api) return;

    infoName.textContent = api.label;
    infoModule.textContent = 'Módulo: ' + api.module;
    var tags = '';
    tags += api.hasSections ? '<span class="tag tag-schema">✓ Schemas YAML</span>' : '<span class="tag tag-nojss">✗ Sin schemas</span>';
    tags += api.hasJsSources ? '<span class="tag tag-js">✓ Fuentes JS</span>' : '<span class="tag tag-nojss">✗ Sin fuentes JS</span>';
    if (api.swaggerUrl) tags += '<a class="tag tag-swagger" href="' + api.swaggerUrl + '" target="_blank">📖 Swagger ↗</a>';
    infoTags.innerHTML = tags;
    apiInfo.classList.remove('hidden');
    checkReady();
  });

  // --- Run ---
  function getSelectedTool() {
    var radio = document.querySelector('input[name="tool"]:checked');
    return radio ? radio.value : null;
  }

  function checkReady() {
    btnRun.disabled = !(getSelectedTool() && apiSelect.value);
  }

  btnRun.addEventListener('click', function () {
    var tool = getSelectedTool();
    var apiKey = apiSelect.value;
    if (!tool || !apiKey) return;

    var server = SERVERS[tool];
    var toolName = tool === 'undocumented' ? '🔍 Undocumented Fields' : '📝 Description Analyzer';

    resultsSection.classList.remove('hidden');
    resultsHeader.textContent = toolName + ' → ' + apiSelect.options[apiSelect.selectedIndex].text;
    statusEl.classList.remove('hidden');
    resultsEl.classList.add('hidden');
    errorEl.classList.add('hidden');
    statusText.textContent = 'Analizando...';
    btnRun.disabled = true;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', server + '/api/analyze?api=' + encodeURIComponent(apiKey), true);
    xhr.onload = function () {
      btnRun.disabled = false;
      statusEl.classList.add('hidden');
      if (xhr.status !== 200) {
        showError('Error del servidor (' + xhr.status + ')');
        return;
      }
      var data = JSON.parse(xhr.responseText);
      if (data.error) {
        showError(data.error);
        return;
      }

      lastCsv = data.csv;
      lastFilename = apiKey.replace(/::/g, '_') + (tool === 'undocumented' ? '_undocumented_fields' : '_field_descriptions') + '.csv';
      resultsEl.classList.remove('hidden');

      if (tool === 'undocumented') {
        statsEl.innerHTML =
          '<div class="stat-card"><div class="number">' + data.stats.yamlFields + '</div><div class="label">Documentados</div></div>' +
          '<div class="stat-card"><div class="number">' + data.stats.jsFields + '</div><div class="label">En Código</div></div>' +
          '<div class="stat-card highlight"><div class="number">' + data.stats.undocumented + '</div><div class="label">Sin Documentar</div></div>';
      } else {
        var s = data.stats;
        statsEl.innerHTML =
          '<div class="stat-card"><div class="number">' + s.total + '</div><div class="label">Total</div></div>' +
          '<div class="stat-card green"><div class="number">' + s.ok + '</div><div class="label">✅ OK</div></div>' +
          '<div class="stat-card red"><div class="number">' + s.bugs + '</div><div class="label">🐛 Bug</div></div>' +
          '<div class="stat-card orange"><div class="number">' + s.errors + '</div><div class="label">⚠️ Error</div></div>' +
          '<div class="stat-card purple"><div class="number">' + s.improvable + '</div><div class="label">ℹ️ Mejorable</div></div>';
      }

      downloadCsv();
    };
    xhr.onerror = function () {
      btnRun.disabled = false;
      statusEl.classList.add('hidden');
      showError('Servidor de análisis no disponible. Ejecuta ./start.sh en local para usar esta herramienta.');
    };
    xhr.send();
  });

  function showError(msg) {
    errorEl.classList.remove('hidden');
    errorEl.textContent = '❌ ' + msg;
  }

  function downloadCsv() {
    if (!lastCsv) return;
    var blob = new Blob([lastCsv], { type: 'text/csv' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = lastFilename;
    a.click();
  }

  btnDownload.addEventListener('click', downloadCsv);

  btnClear.addEventListener('click', function () {
    resultsSection.classList.add('hidden');
    resultsEl.classList.add('hidden');
    errorEl.classList.add('hidden');
    lastCsv = '';
  });

  // --- Init ---
  loadApis();
})();
