(function () {
  'use strict';

  var TOOLS = [
    {
      id: 'undocumented-analyzer',
      icon: '🔍',
      title: 'Undocumented Fields Analyzer',
      description: 'Finds fields used in code but missing from Swagger documentation.',
      url: '../undocumented-analyzer/public/index.html'
    },
    {
      id: 'description-analyzer',
      icon: '📝',
      title: 'Field Description Analyzer',
      description: 'Analyzes and compares Swagger field descriptions against code behavior.',
      url: '../description-analyzer/public/index.html'
    }
  ];

  var grid = document.getElementById('tools-grid');
  grid.innerHTML = TOOLS.map(function (t) {
    return '<a class="tool-card" href="' + t.url + '">' +
      '<span class="tool-icon">' + t.icon + '</span>' +
      '<div class="tool-info"><h3>' + t.title + '</h3><p>' + t.description + '</p></div>' +
    '</a>';
  }).join('');
})();
