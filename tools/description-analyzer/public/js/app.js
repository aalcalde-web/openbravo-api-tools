(function () {
  'use strict';

  var API_BASE = 'http://localhost:8890';

  var apiLabel = document.getElementById('api-label');
  var statusEl = document.getElementById('status');
  var statusText = document.getElementById('status-text');
  var resultsEl = document.getElementById('results');
  var statsEl = document.getElementById('stats');
  var btnDownload = document.getElementById('btn-download');
  var errorEl = document.getElementById('error');

  var lastCsv = '';
  var lastApiKey = '';

  function getHashParam(name) {
    var hash = window.location.hash.replace('#', '');
    var parts = hash.split('&');
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split('=');
      if (kv[0] === name) return decodeURIComponent(kv[1] || '');
    }
    return '';
  }

  function run(apiKey) {
    lastApiKey = apiKey;
    apiLabel.textContent = '📂 ' + apiKey.replace(/::/g, ' → ').replace(/_/g, ' ');
    statusEl.classList.remove('hidden');
    resultsEl.classList.add('hidden');
    errorEl.classList.add('hidden');
    statusText.textContent = 'Analizando...';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', API_BASE + '/api/analyze?api=' + encodeURIComponent(apiKey), true);
    xhr.onload = function () {
      if (xhr.status !== 200) {
        showError('Error del servidor (' + xhr.status + ')');
        return;
      }
      try {
        var data = JSON.parse(xhr.responseText);
        if (data.error) {
          showError(data.error);
          return;
        }
        lastCsv = data.csv;
        statusEl.classList.add('hidden');
        resultsEl.classList.remove('hidden');

        var s = data.stats;
        statsEl.innerHTML =
          '<div class="stat-card"><div class="number">' + s.total + '</div><div class="label">Total</div></div>' +
          '<div class="stat-card green"><div class="number">' + s.ok + '</div><div class="label">✅ OK</div></div>' +
          '<div class="stat-card red"><div class="number">' + s.bugs + '</div><div class="label">🐛 Bug</div></div>' +
          '<div class="stat-card orange"><div class="number">' + s.errors + '</div><div class="label">⚠️ Error</div></div>' +
          '<div class="stat-card purple"><div class="number">' + s.improvable + '</div><div class="label">ℹ️ Mejorable</div></div>';

        downloadCsv();
      } catch (e) {
        showError('Error parseando respuesta');
      }
    };
    xhr.onerror = function () {
      showError('No se pudo conectar al servidor (puerto 8890)');
    };
    xhr.send();
  }

  function showError(msg) {
    statusEl.classList.add('hidden');
    errorEl.classList.remove('hidden');
    errorEl.textContent = '❌ ' + msg;
  }

  function downloadCsv() {
    if (!lastCsv) return;
    var blob = new Blob([lastCsv], { type: 'text/csv' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = lastApiKey.replace(/::/g, '_') + '_field_descriptions.csv';
    a.click();
  }

  btnDownload.addEventListener('click', downloadCsv);

  // --- Init ---
  var apiKey = getHashParam('api');
  if (apiKey) {
    run(apiKey);
  } else {
    statusEl.classList.add('hidden');
    showError('No se ha seleccionado ninguna API. Usa el portal para lanzar el análisis.');
  }
})();
