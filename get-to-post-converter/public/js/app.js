(function () {
  'use strict';

  var schemas = null;
  var entitySelect = document.getElementById('entity-select');
  var modeSelect = document.getElementById('mode-select');
  var fieldsSelect = document.getElementById('fields-select');
  var inputJson = document.getElementById('input-json');
  var outputJson = document.getElementById('output-json');
  var btnConvert = document.getElementById('btn-convert');
  var btnCopy = document.getElementById('btn-copy');
  var btnPaste = document.getElementById('btn-paste');
  var entityInfo = document.getElementById('entity-info');
  var pickerPanel = document.getElementById('picker-panel');
  var pickerList = document.getElementById('field-picker');
  var panelsEl = document.querySelector('.panels');

  fetch('../data/schemas.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      schemas = data;
      populateEntities();
    });

  function populateEntities() {
    var html = '<option value="">— Selecciona API —</option>';
    var names = Object.keys(schemas).sort();
    for (var i = 0; i < names.length; i++) {
      if (schemas[names[i]].import.fields.length > 0) {
        html += '<option value="' + names[i] + '">' + names[i] + '</option>';
      }
    }
    entitySelect.innerHTML = html;
  }

  entitySelect.addEventListener('change', function () {
    var name = entitySelect.value;
    if (!name || !schemas[name]) {
      entityInfo.classList.add('hidden');
      checkReady();
      return;
    }
    var s = schemas[name];
    var reqFields = s.import.fields.filter(function (f) { return f.required; }).map(function (f) { return f.name; });
    entityInfo.classList.remove('hidden');
    entityInfo.innerHTML = '<div>' + s.description + '</div>' +
      '<div class="counts">' +
      '<span>Export: ' + s.export.fields.length + ' campos</span> | ' +
      '<span>Import: ' + s.import.fields.length + ' campos</span> | ' +
      '<span>Obligatorios: ' + reqFields.join(', ') + '</span>' +
      '</div>';
    if (fieldsSelect.value === 'manual') renderFieldPicker();
    checkReady();
  });

  inputJson.addEventListener('input', function () {
    checkReady();
    if (fieldsSelect.value === 'manual') renderFieldPicker();
  });
  modeSelect.addEventListener('change', checkReady);
  fieldsSelect.addEventListener('change', function () {
    if (fieldsSelect.value === 'manual') {
      renderFieldPicker();
    } else {
      hideFieldPicker();
    }
    checkReady();
  });

  function checkReady() {
    btnConvert.disabled = !(entitySelect.value && inputJson.value.trim());
  }

  // --- Field Picker ---
  function renderFieldPicker() {
    var name = entitySelect.value;
    var schema = schemas && schemas[name];
    if (!schema) { hideFieldPicker(); return; }

    var input;
    try { input = JSON.parse(inputJson.value); } catch (e) { hideFieldPicker(); return; }
    if (input.data) input = Array.isArray(input.data) ? input.data[0] : input.data;
    if (Array.isArray(input)) input = input[0];
    if (!input || typeof input !== 'object') { hideFieldPicker(); return; }

    var importFieldMap = {};
    schema.import.fields.forEach(function (f) { importFieldMap[f.name] = f; });

    var html = '';

    // Fields that exist in input AND are valid for import
    for (var i = 0; i < schema.import.fields.length; i++) {
      var field = schema.import.fields[i];
      var fname = field.name;
      var inInput = fname in input;
      var isReq = field.required || field.identifier;

      if (inInput) {
        var checked = isReq ? 'checked disabled' : '';
        var cls = isReq ? 'picker-item required' : 'picker-item';
        html += '<label class="' + cls + '"><input type="checkbox" value="' + fname + '" ' + checked + '> ' + fname + '</label>';
      }
    }

    // Import-only fields (not in GET input)
    var extras = '';
    for (var j = 0; j < schema.import.fields.length; j++) {
      var f2 = schema.import.fields[j];
      if (!(f2.name in input) && !f2.required && !f2.identifier) {
        extras += '<label class="picker-item extra"><input type="checkbox" value="' + f2.name + '"> ' + f2.name + '</label>';
      }
    }
    if (extras) {
      html += '<div class="picker-divider">Solo Import</div>' + extras;
    }

    pickerList.innerHTML = html;
    pickerPanel.classList.remove('hidden');
    panelsEl.classList.add('with-picker');
  }

  function hideFieldPicker() {
    pickerPanel.classList.add('hidden');
    panelsEl.classList.remove('with-picker');
  }

  function getSelectedFields() {
    var checks = pickerList.querySelectorAll('input[type="checkbox"]');
    var selected = [];
    for (var i = 0; i < checks.length; i++) {
      if (checks[i].checked) selected.push(checks[i].value);
    }
    return selected;
  }

  // --- Convert ---
  btnConvert.addEventListener('click', convert);

  function convert() {
    var name = entitySelect.value;
    var schema = schemas[name];
    if (!schema) return;

    var input;
    try { input = JSON.parse(inputJson.value); } catch (e) {
      outputJson.textContent = 'JSON inválido: ' + e.message;
      return;
    }
    if (input.data) input = Array.isArray(input.data) ? input.data[0] : input.data;
    if (Array.isArray(input)) input = input[0];
    if (!input || typeof input !== 'object') {
      outputJson.textContent = 'No se encontró un objeto JSON válido';
      return;
    }

    var mode = modeSelect.value;
    var fieldsMode = fieldsSelect.value;
    var result = {};

    if (fieldsMode === 'manual') {
      var selected = getSelectedFields();
      for (var s = 0; s < selected.length; s++) {
        var sname = selected[s];
        if (sname in input) {
          if (mode === 'patch' && (input[sname] === null || input[sname] === '')) continue;
          result[sname] = input[sname];
        } else {
          result[sname] = null;
        }
      }
    } else {
      for (var j = 0; j < schema.import.fields.length; j++) {
        var field = schema.import.fields[j];
        var fname = field.name;

        if (fieldsMode === 'required' && !field.identifier && !field.required) continue;

        if (fname in input) {
          if (mode === 'patch' && (input[fname] === null || input[fname] === '')) continue;
          result[fname] = input[fname];
        } else if (mode === 'post' && (field.identifier || field.required)) {
          result[fname] = null;
        }
      }
    }

    var jsonStr;
    if (mode === 'post') {
      jsonStr = JSON.stringify([result], null, 2);
    } else {
      jsonStr = JSON.stringify(result, null, 2);
    }

    outputJson.innerHTML = highlightJson(jsonStr, schema);
    outputJson.dataset.raw = jsonStr;
    outputJson.contentEditable = 'true';
  }

  function highlightJson(jsonStr, schema) {
    var identifiers = new Set(schema.import.identifiers);
    var exportFieldNames = new Set(schema.export.fields.map(function (f) { return f.name; }));
    var importOnlyFields = new Set();
    schema.import.fields.forEach(function (f) {
      if (!exportFieldNames.has(f.name)) importOnlyFields.add(f.name);
    });

    var lines = jsonStr.split('\n');
    var result = [];
    for (var l = 0; l < lines.length; l++) {
      var line = lines[l];
      var keyMatch = line.match(/^\s*"([^"]+)"/);
      if (keyMatch) {
        var key = keyMatch[1];
        if (identifiers.has(key)) {
          result.push('<span class="field-id">' + escapeHtml(line) + '</span>');
        } else if (importOnlyFields.has(key)) {
          result.push('<span class="field-manual">' + escapeHtml(line) + '</span>');
        } else {
          result.push(highlightLine(line));
        }
      } else {
        result.push(highlightLine(line));
      }
    }
    return result.join('\n');
  }

  function highlightLine(line) {
    return escapeHtml(line)
      .replace(/"([^"]*)"(\s*:)/g, '<span class="key">"$1"</span>$2')
      .replace(/: "(.*?)"/g, ': <span class="val-str">"$1"</span>')
      .replace(/: (\d+\.?\d*)/g, ': <span class="val-num">$1</span>')
      .replace(/: (true|false)/g, ': <span class="val-bool">$1</span>')
      .replace(/: (null)/g, ': <span class="val-null">$1</span>');
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // --- Buttons ---
  btnCopy.addEventListener('click', function () {
    var raw = outputJson.innerText || outputJson.textContent;
    navigator.clipboard.writeText(raw).then(function () {
      btnCopy.textContent = '✓ Copiado';
      setTimeout(function () { btnCopy.textContent = 'Copiar'; }, 1500);
    });
  });

  btnPaste.addEventListener('click', function () {
    navigator.clipboard.readText().then(function (text) {
      inputJson.value = text;
      checkReady();
      if (fieldsSelect.value === 'manual') renderFieldPicker();
    });
  });
})();
