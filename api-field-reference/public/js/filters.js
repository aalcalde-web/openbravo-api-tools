window.AppFilters = (function() {

  function getEndpoints(data) {
    var set = {};
    data.forEach(function(d) { set[d.endpoint] = true; });
    return Object.keys(set);
  }

  function applyFilters(container, filters) {
    var groups = container.querySelectorAll('.endpoint-group');
    var visibleCount = 0;

    groups.forEach(function(group) {
      var ep = group.dataset.endpoint;
      var sec = group.dataset.section;
      var epMatch = filters.endpoint === 'ALL' || ep === filters.endpoint;
      var secMatch = filters.section === 'ALL' || sec === filters.section;

      if (!epMatch || !secMatch) {
        group.style.display = 'none';
        return;
      }
      group.style.display = '';

      var fields = group.querySelectorAll('.field');
      fields.forEach(function(field) {
        var sev = field.dataset.severity;
        var sevMatch = filters.severity === 'ALL' || (Array.isArray(filters.severity) && filters.severity.indexOf(sev) !== -1);
        if (sevMatch) {
          field.classList.remove('filtered-out');
          visibleCount++;
        } else {
          field.classList.add('filtered-out');
        }
      });
    });

    return visibleCount;
  }

  function collectVisibleFields(container) {
    var results = [];
    var groups = container.querySelectorAll('.endpoint-group');

    groups.forEach(function(group) {
      if (group.style.display === 'none') return;
      var ep = group.dataset.endpoint;
      var sec = group.dataset.section;

      group.querySelectorAll('.field').forEach(function(field) {
        if (field.classList.contains('filtered-out')) return;
        var nameRow = field.querySelector('.fname-row');
        var name = '';
        if (nameRow) {
          var clone = nameRow.cloneNode(true);
          var toggleEl = clone.querySelector('.toggle');
          if (toggleEl) toggleEl.remove();
          var spacerEl = clone.querySelector('.spacer');
          if (spacerEl) spacerEl.remove();
          var indentEl = clone.querySelector('.indent');
          if (indentEl) indentEl.remove();
          var sevEl = clone.querySelector('.sev');
          if (sevEl) sevEl.remove();
          name = clone.textContent.trim();
        }
        var pathEl = field.querySelector('.fpath');
        var path = pathEl ? pathEl.textContent.trim() : '';
        var type = field.querySelector('.ftype').textContent.trim();
        var severity = field.dataset.severity || '';
        var descEl = field.querySelector('.fdesc');
        var swaggerDesc = '';
        var codeDesc = '';
        if (descEl) {
          var codeEl = descEl.querySelector('.desc-code');
          codeDesc = codeEl ? codeEl.textContent.trim() : '';
          var fullText = descEl.textContent.trim();
          if (codeDesc) {
            swaggerDesc = fullText.replace(codeDesc, '').trim();
          } else {
            swaggerDesc = fullText;
          }
        }

        results.push({ endpoint: ep, section: sec, name: name, path: path, type: type, severity: severity, swaggerDesc: swaggerDesc, codeDesc: codeDesc });
      });
    });

    return results;
  }

  return {
    getEndpoints: getEndpoints,
    applyFilters: applyFilters,
    collectVisibleFields: collectVisibleFields
  };

})();
