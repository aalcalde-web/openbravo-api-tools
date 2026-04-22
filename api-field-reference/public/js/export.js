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
      if (s === 'bug') return '#c0392b';
      if (s === 'error') return '#856404';
      if (s === 'mejorable') return '#4a4a8a';
      return '#27ae60';
    };

    var sevLabel = function(s) {
      if (s === 'bug') return 'BUG';
      if (s === 'error') return 'ERROR';
      if (s === 'mejorable') return 'MEJORABLE';
      return 'OK';
    };

    var currentGroup = '';
    var tableRows = '';

    fields.forEach(function(f) {
      var group = f.endpoint + ' — ' + f.section;
      if (group !== currentGroup) {
        if (currentGroup) tableRows += '</tbody></table><br>';
        currentGroup = group;
        tableRows += '<h3 style="margin:16px 0 8px;color:#2c3e50">' + group + '</h3>';
        tableRows += '<table style="width:100%;border-collapse:collapse;font-size:11px;table-layout:fixed">';
        tableRows += '<colgroup>';
        tableRows += '<col style="width:75px">';
        tableRows += '<col style="width:120px">';
        tableRows += '<col style="width:180px">';
        tableRows += '<col style="width:70px">';
        tableRows += '<col>';
        tableRows += '<col>';
        tableRows += '</colgroup>';
        tableRows += '<thead><tr style="background:#2c3e50;color:#fff">';
        tableRows += '<th style="padding:6px 8px;text-align:left">Severity</th>';
        tableRows += '<th style="padding:6px 8px;text-align:left">Name</th>';
        tableRows += '<th style="padding:6px 8px;text-align:left">Field Path</th>';
        tableRows += '<th style="padding:6px 8px;text-align:left">Type</th>';
        tableRows += '<th style="padding:6px 8px;text-align:left">Swagger Description</th>';
        tableRows += '<th style="padding:6px 8px;text-align:left">Code Description</th>';
        tableRows += '</tr></thead><tbody>';
      }
      var swaggerDesc = f.swaggerDesc.length > 150 ? f.swaggerDesc.substring(0, 150) + '...' : f.swaggerDesc;
      var codeDesc = f.codeDesc.length > 150 ? f.codeDesc.substring(0, 150) + '...' : f.codeDesc;
      tableRows += '<tr style="border-bottom:1px solid #e0e0e0">';
      tableRows += '<td style="padding:5px 8px"><span style="color:' + sevColor(f.severity) + ';font-weight:700;font-size:10px">' + sevLabel(f.severity) + '</span></td>';
      tableRows += '<td style="padding:5px 8px;font-family:monospace;font-weight:600">' + f.name + '</td>';
      tableRows += '<td style="padding:5px 8px;font-family:monospace;font-size:10px">' + f.path + '</td>';
      tableRows += '<td style="padding:5px 8px;font-family:monospace;color:#61affe">' + f.type + '</td>';
      tableRows += '<td style="padding:5px 8px;font-size:10px">' + swaggerDesc + '</td>';
      tableRows += '<td style="padding:5px 8px;font-size:10px;color:#666;font-style:italic">' + codeDesc + '</td>';
      tableRows += '</tr>';
    });
    if (currentGroup) tableRows += '</tbody></table>';

    var html = '<!DOCTYPE html><html><head>' +
      '<title>' + apiName + ' — Field Export</title>' +
      '<style>' +
      'body { font-family: -apple-system, sans-serif; padding: 24px; color: #333; }' +
      'h1 { font-size: 20px; margin-bottom: 4px; }' +
      'h2 { font-size: 13px; color: #888; margin-bottom: 24px; font-weight: 400; }' +
      '@media print { body { padding: 12px; } }' +
      '</style></head><body>' +
      '<h1>' + apiName + '</h1>' +
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
