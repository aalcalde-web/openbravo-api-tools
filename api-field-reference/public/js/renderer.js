window.AppRenderer = (function() {

  function sevHtml(s) {
    if (s.includes('BUG')) return '<span class="sev sev-bug">BUG</span>';
    if (s.includes('ERROR')) return '<span class="sev sev-err">ERROR DESC</span>';
    if (s.includes('MEJORABLE')) return '<span class="sev sev-info">MEJORABLE</span>';
    return '';
  }

  function sevClass(s) {
    if (s.includes('BUG')) return 'bug';
    if (s.includes('ERROR')) return 'error';
    if (s.includes('MEJORABLE')) return 'mejorable';
    return 'ok';
  }

  function renderField(f, depth, parentId) {
    var hasKids = f.children && f.children.length > 0;
    var id = parentId + '_' + f.path.replace(/[\[\].]/g, '_');
    var indent = depth * 20;
    var sc = sevClass(f.severity);

    var h = '<div class="field" data-parent="' + parentId + '" data-id="' + id + '" data-severity="' + sc + '" data-path="' + f.path + '"' + (depth > 0 ? ' style="display:none"' : '') + '>';
    h += '<div class="fname">';
    h += '<div class="fname-row"><span class="indent" style="width:' + indent + 'px"></span>';
    if (hasKids) {
      h += '<span class="toggle" data-target="' + id + '">▶</span>';
    } else {
      h += '<span class="spacer"></span>';
    }
    h += f.name + sevHtml(f.severity) + '</div>';
    if (f.path) {
      h += '<div class="fpath" style="padding-left:' + (indent + 22) + 'px">' + f.path + '</div>';
    }
    h += '</div>';
    h += '<div class="ftype">' + f.type + '</div>';
    h += '<div class="fdesc">' + f.desc + '</div></div>';

    if (hasKids) {
      f.children.forEach(function(c) { h += renderField(c, depth + 1, id); });
    }
    return h;
  }

  function toggleSection(el) {
    var body = el.parentElement.querySelector('.ep-body');
    var chev = el.querySelector('.chevron');
    if (body.style.display === 'none') {
      body.style.display = '';
      chev.classList.add('open');
    } else {
      body.style.display = 'none';
      chev.classList.remove('open');
    }
  }

  function toggleChildren(el) {
    var target = el.dataset.target;
    var open = el.textContent === '▶';
    el.textContent = open ? '▼' : '▶';
    var rows = document.querySelectorAll('[data-parent="' + target + '"]');
    rows.forEach(function(row) {
      if (row.classList.contains('filtered-out')) return;
      row.style.display = open ? '' : 'none';
      if (!open) {
        var t = row.querySelector('.toggle');
        if (t && t.textContent === '▼') toggleChildren(t);
      }
    });
  }

  function bindEvents(container) {
    container.querySelectorAll('.ep-header').forEach(function(header) {
      header.addEventListener('click', function() { toggleSection(header); });
    });
    container.querySelectorAll('.toggle').forEach(function(toggle) {
      toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleChildren(toggle);
      });
    });
  }

  function renderApi(data, container) {
    var html = '';
    data.forEach(function(d) {
      var cls = d.section === 'REQUEST' ? 'req' : 'res';
      var gid = d.endpoint + '_' + d.section;
      html += '<div class="endpoint-group ' + cls + '" data-endpoint="' + d.endpoint + '" data-section="' + d.section + '">';
      html += '<div class="ep-header">';
      html += '<span class="method">' + d.section + '</span>';
      html += '<span class="title">' + d.endpoint + '</span>';
      html += '<span class="chevron open">▶</span></div>';
      html += '<div class="ep-body" style="display:none">';
      d.fields.forEach(function(f) { html += renderField(f, 0, gid); });
      html += '</div></div>';
    });
    container.innerHTML = html;
    bindEvents(container);
  }

  return { renderApi: renderApi };

})();
