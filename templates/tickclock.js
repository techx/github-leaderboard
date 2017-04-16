// Tik clock in JS
// @author Anthony Liu
// @date 2017/04/15
// @license MIT

var TickClock = (function() {
  // config
  var COL_HEIGHT = 3;
  var SECTIONS = [1, 3, 2, 3]; // left to right, hours to minutes
  var BUFFER_IN_PX = 10; // between sections
  var TICK_FREQUENCY = 1000;
  var ON_COLOR = '#d03035';
  var OFF_COLOR = '#cdcdcd';

  // constants
  var NUM_COLS = SECTIONS.reduce(function(a, b) {
    return a + b;
  });

  function initTickClock(parentId) {
    // populate the html
    populateHtml(parentId);

    // size the clock properly
    resizeClock(parentId);

    // start ticking!
    updateClock();
    setInterval(updateClock, TICK_FREQUENCY);

    // dynamically resize
    window.addEventListener('resize', function() {
      resizeClock(parentId);
    });
  }

  function populateHtml(parentId) {
    SECTIONS.map(function(count, index) {
      var section = document.createElement('div');
      section.id = 'tick-section-' + index;
      section.className = 'tick-section';
      if (index !== SECTIONS.length - 1) {
        section.style.marginRight = BUFFER_IN_PX + 'px';
      }

      var base = 'tick-cell-' + index + '-';
      for (var i = 0; i < count * COL_HEIGHT; i++) {
        var cell = generateCell(base, i);
        section.appendChild(cell);
      }

      document.getElementById(parentId).appendChild(section);
    });
  }

  function generateCell(base, index) {
    var div = document.createElement('div');
    div.id = base + index;
    div.className = 'tick-cell';
    div.innerHTML = '&nbsp;';
    return div;
  }

  function resizeClock(parentId) {
    // resize cells
    var width = document.getElementById(
      parentId
    ).getBoundingClientRect().width;
    var workingWidth = width - BUFFER_IN_PX * (
      SECTIONS.length - 1
    );
    var cellWidth = Math.floor(workingWidth / NUM_COLS);
    var cells = document.getElementsByClassName('tick-cell');
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.width = cellWidth + 'px';
      cells[i].style.height = cellWidth + 'px';
    }

    // resize sections
    for (var i = 0; i < SECTIONS.length; i++) {
      document.getElementById(
        'tick-section-' + i
      ).style.width = cellWidth * SECTIONS[i] + 'px';
    }
  }

  function updateClock() {
    clearClock();

    var d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    setSection(0, Math.floor(hours / 10));
    setSection(1, hours % 10);
    setSection(2, Math.floor(minutes / 10));
    setSection(3, minutes % 10);
  }

  function clearClock() {
    SECTIONS.map(function(count, index) {
      for (var i = 0; i < count * COL_HEIGHT; i++) {
        clearCell('tick-cell-' + index + '-' + i);
      }
    });
  }

  function setSection(index, n) {
    var numCells = SECTIONS[index] * COL_HEIGHT;
    var arr = [];
    for (var i = 0; i < numCells; i++) arr.push(i);
    permute(arr).slice(0, n).map(function(i) {
      colorCell('tick-cell-' + index + '-' + i);
    });
  }

  function permute(arr) {
    arr.sort(function(a, b) {return Math.random() - 0.5});
    return arr;
  }

  function colorCell(id) {
    document.getElementById(id).style.background = ON_COLOR;
  }

  function clearCell(id) {
    document.getElementById(id).style.background = OFF_COLOR;
  }

  return {
    init: initTickClock
  };
})();

window.addEventListener('load', function() {
  var parentId = 'clock';
  TickClock.init(parentId);
});
