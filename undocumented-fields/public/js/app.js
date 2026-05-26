(function () {
  'use strict';

  var currentApi = 'orders';
  var tbody = document.getElementById('tbody');
  var countEl = document.getElementById('count');
  var filterEndpoint = document.getElementById('filter-endpoint');
  var filterDirection = document.getElementById('filter-direction');
  var filterLevel = document.getElementById('filter-level');
  var searchInput = document.getElementById('search');
  var tooltip = document.getElementById('tooltip');

  function getData() {
    return currentApi === 'orders' ? DATA_ORDERS : DATA_DISCOUNTS;
  }

  function unique(arr, key) {
    var seen = {};
    return arr.reduce(function (acc, r) {
      var v = r[key];
      if (v && !seen[v]) { seen[v] = true; acc.push(v); }
      return acc;
    }, []);
  }

  function populateFilters() {
    var data = getData();
    filterEndpoint.innerHTML = '<option value="ALL">All endpoints</option>' +
      unique(data, 'endpoint').map(function (e) { return '<option>' + e + '</option>'; }).join('');
    filterDirection.innerHTML = '<option value="ALL">All directions</option>' +
      unique(data, 'direction').map(function (d) { return '<option>' + d + '</option>'; }).join('');
    filterLevel.innerHTML = '<option value="ALL">All levels</option>' +
      unique(data, 'level').map(function (l) { return '<option>' + l + '</option>'; }).join('');
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function renderRow(r) {
    return '<tr>' +
      '<td>' + esc(r.endpoint) + '</td>' +
      '<td>' + esc(r.direction) + '</td>' +
      '<td><span class="level-badge level-' + r.level + '">' + esc(r.level) + '</span></td>' +
      '<td class="field-path">' + esc(r.path) + '</td>' +
      '<td class="field-type">' + esc(r.type) + '</td>' +
      '<td><span class="value-badge value-' + r.value + '">' + esc(r.value) + '</span></td>' +
      '<td class="cell-wrap">' + esc(r.risk) + '</td>' +
      '<td class="cell-wrap">' + esc(r.recommendation) + '</td>' +
      '<td class="cell-wrap">' + esc(r.description) + '</td>' +
      '<td class="cell-wrap">' + esc(r.howItWorks) + '</td>' +
      '<td class="code-ref">' + esc(r.codeRef) + '</td>' +
    '</tr>';
  }

  function getFiltered() {
    var data = getData();
    var ep = filterEndpoint.value;
    var dir = filterDirection.value;
    var lvl = filterLevel.value;
    var q = searchInput.value.toLowerCase();

    return data.filter(function (r) {
      if (ep !== 'ALL' && r.endpoint !== ep) return false;
      if (dir !== 'ALL' && r.direction !== dir) return false;
      if (lvl !== 'ALL' && r.level !== lvl) return false;
      if (q) {
        var text = (r.path + ' ' + r.name + ' ' + r.description + ' ' + r.howItWorks + ' ' + r.codeRef + ' ' + r.value + ' ' + r.risk + ' ' + r.recommendation).toLowerCase();
        if (text.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function render() {
    var filtered = getFiltered();
    tbody.innerHTML = filtered.map(renderRow).join('');
    countEl.textContent = filtered.length;
  }

  // Tooltip
  var tableContainer = document.querySelector('.table-container');

  tableContainer.addEventListener('mouseover', function (e) {
    var td = e.target.closest('td');
    if (!td) return;
    if (td.scrollWidth <= td.clientWidth) return;
    tooltip.textContent = td.textContent;
    tooltip.classList.add('visible');
  });

  tableContainer.addEventListener('mousemove', function (e) {
    if (!tooltip.classList.contains('visible')) return;
    var x = e.clientX + 12;
    var y = e.clientY + 12;
    if (x + tooltip.offsetWidth > window.innerWidth - 10) {
      x = e.clientX - tooltip.offsetWidth - 12;
    }
    if (y + tooltip.offsetHeight > window.innerHeight - 10) {
      y = e.clientY - tooltip.offsetHeight - 12;
    }
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
  });

  tableContainer.addEventListener('mouseout', function (e) {
    var td = e.target.closest('td');
    if (!td) return;
    tooltip.classList.remove('visible');
  });

  // API tabs
  document.querySelector('.api-tabs').addEventListener('click', function (e) {
    var tab = e.target.closest('.api-tab');
    if (!tab) return;
    document.querySelectorAll('.api-tab').forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');
    currentApi = tab.dataset.api;
    searchInput.value = '';
    populateFilters();
    render();
  });

  // Clear filters
  document.getElementById('clear-filters').addEventListener('click', function () {
    filterEndpoint.value = 'ALL';
    filterDirection.value = 'ALL';
    filterLevel.value = 'ALL';
    searchInput.value = '';
    render();
  });

  // Filters
  filterEndpoint.addEventListener('change', render);
  filterDirection.addEventListener('change', render);
  filterLevel.addEventListener('change', render);
  searchInput.addEventListener('input', render);

  // CSV export
  document.getElementById('export-csv').addEventListener('click', function () {
    var filtered = getFiltered();
    var headers = ['Endpoint', 'Direction', 'Level', 'Field Path', 'Field Name', 'Type', 'Value', 'Risk', 'Recommendation', 'Description', 'How it works', 'Code Reference'];
    var csvRows = [headers.join(',')];
    filtered.forEach(function (r) {
      csvRows.push([r.endpoint, r.direction, r.level, r.path, r.name, r.type,
        '"' + r.value.replace(/"/g, '""') + '"',
        '"' + r.risk.replace(/"/g, '""') + '"',
        '"' + r.recommendation.replace(/"/g, '""') + '"',
        '"' + r.description.replace(/"/g, '""') + '"',
        '"' + r.howItWorks.replace(/"/g, '""') + '"',
        '"' + r.codeRef.replace(/"/g, '""') + '"'
      ].join(','));
    });
    var blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'undocumented_fields_' + currentApi + '.csv';
    a.click();
  });

  // PDF export
  document.getElementById('export-pdf').addEventListener('click', function () {
    var filtered = getFiltered();
    var doc = new jspdf.jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    var title = currentApi === 'orders' ? 'External Orders' : 'External Discounts';
    doc.setFontSize(14);
    doc.setTextColor(72, 40, 130);
    doc.text('Undocumented Fields — ' + title, 14, 15);

    var headers = [['Endpoint', 'Dir', 'Level', 'Field Path', 'Type', 'Value', 'Risk', 'Recommendation', 'Description', 'How it works', 'Code Ref']];
    var rows = filtered.map(function (r) {
      return [r.endpoint, r.direction, r.level, r.path, r.type, r.value, r.risk, r.recommendation, r.description, r.howItWorks, r.codeRef];
    });

    doc.autoTable({
      head: headers,
      body: rows,
      startY: 22,
      styles: { font: 'helvetica', fontSize: 6, cellPadding: 2 },
      headStyles: { fillColor: [72, 40, 130], textColor: 255, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 16 },
        1: { cellWidth: 10 },
        2: { cellWidth: 12 },
        3: { cellWidth: 38 },
        4: { cellWidth: 12 },
        5: { cellWidth: 12 },
        6: { cellWidth: 30 },
        7: { cellWidth: 22 },
        8: { cellWidth: 40 },
        9: { cellWidth: 55 },
        10: { cellWidth: 30 }
      },
      alternateRowStyles: { fillColor: [245, 240, 250] }
    });

    doc.save('undocumented_fields_' + currentApi + '.pdf');
  });

  // Init
  populateFilters();
  render();
})();
