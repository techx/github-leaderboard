var TickClock = (function() {
  // config
  var COL_HEIGHT = 3;
  var SECTIONS = [1, 3, 2, 3]; // left to right, hours to minutes
  var BUFFER_IN_PX = 10; // between sections

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
    setInterval(updateClock, 1000);

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
    setTickHoursTen(Math.floor(hours / 10));
    setTickHoursOne(hours % 10);
    setTickMinutesTen(Math.floor(minutes / 10));
    setTickMinutesOne(minutes % 10);
  }

  function clearClock() {
    for (var i = 0; i < 3; i++)   {
      clearCell('hours-tens-' + i);
    }
    for (var i = 0; i < 9; i++)   {
      clearCell('hours-ones-' + i);
    }
    for (var i = 0; i < 6; i++)   {
      clearCell('minutes-tens-' + i);
    }
    for (var i = 0; i < 9; i++)   {
      clearCell('minutes-ones-' + i);
    }
  }

  function setTickHoursTen(n) {
    permute([0, 1, 2]).slice(0, n).map(function(i) {
      colorCell('hours-tens-' + i);
    });
  }
  function setTickHoursOne(n) {
    permute([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, n).map(function(i) {
      colorCell('hours-ones-' + i);
    });
  }
  function setTickMinutesTen(n) {
    permute([0, 1, 2, 3, 4, 5]).slice(0, n).map(function(i) {
      colorCell('minutes-tens-' + i);
    });
  }

  function setTickMinutesOne(n) {
    permute([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, n).map(function(i) {
      colorCell('minutes-ones-' + i);
    });
  }

  function permute(arr) {
    var comparer = function(a, b) {
      return 2 * Math.random() - 1;
    };
    arr.sort(comparer);
    return arr;
  }

  function colorCell(id) {
    document.getElementById(id).style.background = 'red';
  }

  function clearCell(id) {
    document.getElementById(id).style.background = 'blue';
  }

  return {
    init: initTickClock
  };
})();

window.addEventListener('load', function() {
  TickClock.init('clock');
});
