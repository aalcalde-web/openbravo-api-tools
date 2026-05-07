window.AppExport = (function() {

  function exportCsv(fields, apiName) {
    var headers = ['Severity', 'Field Name', 'Field Path', 'Type', 'Endpoint', 'Section', 'Swagger Description', 'Code Description'];
    var rows = fields.map(function(f) {
      return [
        f.severity,
        f.name,
        f.path,
        f.type,
        f.endpoint,
        f.section,
        '"' + f.swaggerDesc.replace(/"/g, '""') + '"',
        '"' + f.codeDesc.replace(/"/g, '""') + '"'
      ];
    });

    var csv = headers.join(',') + '\n';
    rows.forEach(function(r) { csv += r.join(',') + '\n'; });

    download(csv, apiName.replace(/ /g, '_') + '_export.csv', 'text/csv');
  }

  function exportPdf(fields, apiName) {
    var win = window.open('', '_blank');
    if (!win) {
      alert('Please allow popups to export PDF');
      return;
    }

    var sevColor = function(s) {
      if (s === 'bug') return '#e8005f';
      if (s === 'error') return '#e65100';
      if (s === 'mejorable') return '#482882';
      return '#27ae60';
    };

    var sevLabel = function(s) {
      if (s === 'bug') return 'BUG';
      if (s === 'error') return 'ERROR';
      if (s === 'mejorable') return 'MEJORABLE';
      return 'OK';
    };

    var esc = function(s) {
      return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    var currentGroup = '';
    var tableRows = '';

    fields.forEach(function(f) {
      var group = f.endpoint + ' — ' + f.section;
      if (group !== currentGroup) {
        if (currentGroup) tableRows += '</tbody></table><br>';
        currentGroup = group;
        tableRows += '<h3>' + esc(group) + '</h3>';
        tableRows += '<table>';
        tableRows += '<colgroup>';
        tableRows += '<col class="col-sev">';
        tableRows += '<col class="col-name">';
        tableRows += '<col class="col-path">';
        tableRows += '<col class="col-type">';
        tableRows += '<col class="col-desc">';
        tableRows += '<col class="col-code">';
        tableRows += '</colgroup>';
        tableRows += '<thead><tr>';
        tableRows += '<th>Severity</th>';
        tableRows += '<th>Name</th>';
        tableRows += '<th>Field Path</th>';
        tableRows += '<th>Type</th>';
        tableRows += '<th>Swagger Description</th>';
        tableRows += '<th>Code Description</th>';
        tableRows += '</tr></thead><tbody>';
      }
      tableRows += '<tr>';
      tableRows += '<td><span class="sev" style="color:' + sevColor(f.severity) + '">' + sevLabel(f.severity) + '</span></td>';
      tableRows += '<td class="mono bold">' + esc(f.name) + '</td>';
      tableRows += '<td class="mono small">' + esc(f.path) + '</td>';
      tableRows += '<td class="mono type">' + esc(f.type) + '</td>';
      tableRows += '<td class="small">' + esc(f.swaggerDesc) + '</td>';
      tableRows += '<td class="small italic">' + esc(f.codeDesc) + '</td>';
      tableRows += '</tr>';
    });
    if (currentGroup) tableRows += '</tbody></table>';

    var html = '<!DOCTYPE html><html><head>' +
      '<title>' + esc(apiName) + ' — Field Export</title>' +
      '<style>' +
      '@page { size: landscape; margin: 12mm; }' +
      'body { font-family: Helvetica, Arial, sans-serif; padding: 16px; color: #2e2e3e; font-size: 9px; }' +
      'h1 { font-size: 16px; color: #482882; margin-bottom: 2px; }' +
      'h2 { font-size: 11px; color: #808090; margin-bottom: 20px; font-weight: 400; }' +
      'h3 { font-size: 12px; color: #482882; margin: 14px 0 6px; }' +
      'table { width: 100%; border-collapse: collapse; table-layout: fixed; }' +
      '.col-sev { width: 6%; }' +
      '.col-name { width: 10%; }' +
      '.col-path { width: 16%; }' +
      '.col-type { width: 6%; }' +
      '.col-desc { width: 31%; }' +
      '.col-code { width: 31%; }' +
      'th { background: #482882; color: #fff; padding: 5px 6px; text-align: left; font-size: 8px; font-weight: 600; }' +
      'td { padding: 4px 6px; border-bottom: 1px solid #e0e0e0; vertical-align: top; word-wrap: break-word; overflow-wrap: break-word; white-space: normal; }' +
      'tr:nth-child(even) { background: #f8f7fc; }' +
      '.mono { font-family: Courier New, monospace; }' +
      '.bold { font-weight: 600; }' +
      '.small { font-size: 8px; line-height: 1.4; }' +
      '.type { color: #8064A2; }' +
      '.italic { color: #666; font-style: italic; }' +
      '.sev { font-weight: 700; font-size: 8px; }' +
      '@media print { body { padding: 0; } }' +
      '</style></head><body>' +
      '<h1>' + esc(apiName) + '</h1>' +
      '<h2>Exported ' + fields.length + ' fields — ' + new Date().toLocaleString() + '</h2>' +
      tableRows +
      '<script>window.onload = function() { window.print(); }<\/script>' +
      '</body></html>';

    win.document.write(html);
    win.document.close();
  }

  function download(content, filename, mime) {
    var blob = new Blob([content], { type: mime });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return {
    exportCsv: exportCsv,
    exportPdf: exportPdf
  };

})();
