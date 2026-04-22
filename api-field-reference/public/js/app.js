(function() {

  var apis = {
    orders:    { data: window.DATA_ORDERS,    name: 'External Orders API' },
    discounts: { data: window.DATA_DISCOUNTS, name: 'External Discounts API' }
  };

  var currentApi = 'orders';

  function init() {
    bindNav();
    bindFilters();
    bindSeverityMultiSelect();
    bindExport();
    switchApi('orders');
  }

  function switchApi(key) {
    currentApi = key;
    var api = apis[key];

    document.querySelectorAll('.nav-item').forEach(function(el) {
      el.classList.toggle('active', el.dataset.api === key);
    });

    document.getElementById('toolbar-title').textContent = api.name;
    populateEndpointFilter(api.data);
    resetFilters();

    var container = document.getElementById('content');
    AppRenderer.renderApi(api.data, container);
    runFilters();
  }

  function populateEndpointFilter(data) {
    var select = document.getElementById('filter-endpoint');
    var endpoints = AppFilters.getEndpoints(data);
    select.innerHTML = '<option value="ALL">All endpoints</option>';
    endpoints.forEach(function(ep) {
      select.innerHTML += '<option value="' + ep + '">' + ep + '</option>';
    });
  }

  function resetFilters() {
    document.querySelectorAll('.sev-check').forEach(function(cb) { cb.checked = false; });
    updateSeverityLabel();
    document.getElementById('filter-endpoint').value = 'ALL';
    document.getElementById('filter-section').value = 'ALL';
  }

  function getSelectedSeverities() {
    var checked = [];
    document.querySelectorAll('.sev-check:checked').forEach(function(cb) {
      checked.push(cb.value);
    });
    return checked.length === 0 ? 'ALL' : checked;
  }

  function updateSeverityLabel() {
    var selected = getSelectedSeverities();
    var trigger = document.getElementById('severity-trigger');
    if (selected === 'ALL') {
      trigger.textContent = 'All';
    } else {
      var labels = { bug: 'BUG', error: 'ERROR', mejorable: 'MEJORABLE', ok: 'OK' };
      trigger.textContent = selected.map(function(s) { return labels[s]; }).join(', ');
    }
  }

  function runFilters() {
    var severity = getSelectedSeverities();
    var endpoint = document.getElementById('filter-endpoint').value;
    var section = document.getElementById('filter-section').value;
    var container = document.getElementById('content');
    var count = AppFilters.applyFilters(container, { severity: severity, endpoint: endpoint, section: section });
    document.getElementById('field-count').textContent = count;
  }

  function bindNav() {
    document.querySelectorAll('.nav-item').forEach(function(el) {
      el.addEventListener('click', function() { switchApi(el.dataset.api); });
    });
  }

  function bindFilters() {
    ['filter-endpoint', 'filter-section'].forEach(function(id) {
      document.getElementById(id).addEventListener('change', runFilters);
    });
  }

  function bindSeverityMultiSelect() {
    var trigger = document.getElementById('severity-trigger');
    var dropdown = document.getElementById('severity-dropdown');

    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
      // Close export menu if open
      document.getElementById('export-menu').classList.remove('open');
    });

    dropdown.addEventListener('click', function(e) {
      e.stopPropagation();
    });

    document.querySelectorAll('.sev-check').forEach(function(cb) {
      cb.addEventListener('change', function() {
        updateSeverityLabel();
        runFilters();
      });
    });

    document.addEventListener('click', function() {
      dropdown.classList.remove('open');
    });
  }

  function bindExport() {
    var btn = document.getElementById('export-btn');
    var menu = document.getElementById('export-menu');

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      menu.classList.toggle('open');
      // Close severity dropdown if open
      document.getElementById('severity-dropdown').classList.remove('open');
    });

    document.addEventListener('click', function() {
      menu.classList.remove('open');
    });

    document.getElementById('export-csv').addEventListener('click', function() {
      var fields = AppFilters.collectVisibleFields(document.getElementById('content'));
      AppExport.exportCsv(fields, apis[currentApi].name);
      menu.classList.remove('open');
    });

    document.getElementById('export-pdf').addEventListener('click', function() {
      var fields = AppFilters.collectVisibleFields(document.getElementById('content'));
      AppExport.exportPdf(fields, apis[currentApi].name);
      menu.classList.remove('open');
    });
  }

  document.addEventListener('DOMContentLoaded', init);

})();
