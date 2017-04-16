var Dash = (function() {
  // config
  var DATE_UPDATE_FREQUENCY = 5000;
  var COMMIT_UPDATE_FREQUENCY = 5 * 60 * 1000;
  var EVENT_FREQUENCY = 60 * 60 * 1000;
  var LEADERBOARD_API = '/api/leaderboard';
  var EVENTS_API = '/api/events';
  var TOP_X = 5; // displays top this many contributors
  var GITHUB_URL = function(name) {
    return 'https://github.com/' + name;
  };

  // constants
  var MONTH_NAMES = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
  ];

  function initDash() {
    initDate();
    initEvents();
    initLeaderboard();
  }

  function initDate() {
    updateDate();
    setInterval(updateDate, DATE_UPDATE_FREQUENCY);
  }

  function updateDate() {
    var d = new Date();
    var yearOffset = 1900;
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var year = yearOffset + d.getYear();
    var dateString = month + '.' + day + '.' + year;
    document.getElementById(
      'date-string'
    ).innerHTML = dateString;
  }

  function initEvents() {
    updateEvents();
    setInterval(updateEvents, EVENT_FREQUENCY);
  }

  function initLeaderboard() {
    updateLeaderboard();
    setInterval(updateLeaderboard, COMMIT_UPDATE_FREQUENCY);
  }

  function updateLeaderboard() {
    $.get(
      LEADERBOARD_API
    ).done(function(raw) {
      var data = JSON.parse(raw);
      if ('leaderboard' in data) {
        populateLeaderboard(data.leaderboard);
      } else {
        // uh-oh
      }
    });
  }

  function updateEvents() {
    $.get(
      EVENTS_API
    ).done(function(raw) {
      var data = JSON.parse(raw);
      if ('events' in data) {
        populateEvents(data.events);
      } else {
        // uh-oh
      }
    });
  }

  // Populates the leaderboard with the provided leaders.
  // @param leaders a [{username: ..., commits: ...}, ...]
  function populateLeaderboard(leaders) {
    // clear the old leaderboard
    document.getElementById('leaderboard').innerHTML = '';

    // add the provided leaders
    for (var i = 0; i < Math.min(TOP_X, leaders.length); i++) {
      var leader = leaders[i];
      var li = document.createElement('li'); 
      li.className = 'normal';
      var username = document.createElement('a');
      username.href = GITHUB_URL(leader.name);
      username.className = 'username';
      username.innerHTML = leader.name;
      var commits = document.createElement('span'); 
      commits.className = 'commits';
      commits.innerHTML = leader.commits;
      li.appendChild(username);
      li.append(' with ');
      li.appendChild(commits);
      li.append(' commits ');
      document.getElementById('leaderboard').appendChild(li);
    }

    // display other contributors
    if (leaders.length > TOP_X) {
      var count = 0;
      for (var i = TOP_X; i < leaders.length; i++) {
        count += leaders[i].commits;
      }

      // incidental similarity with the above block of
      // similar code; conscious choice to not abstract
      // to a reusable function
      var li = document.createElement('li'); 
      var username = document.createElement('span'); 
      username.className = 'username';
      username.innerHTML = 'Others';
      var commits = document.createElement('span'); 
      commits.className = 'commits';
      commits.innerHTML = count;
      var space = '\u00A0\u00A0\u00A0';
      li.appendChild(document.createTextNode(space));
      li.appendChild(username);
      li.append(' with ');
      li.appendChild(commits);
      li.append(' commits ');
      document.getElementById('leaderboard').appendChild(li);
    }
  }

  function populateEvents(allEvents) {
    document.getElementById('event-list').innerHTML = '';

    for (var i = 0; i < allEvents.length; i++) {
      var ev = allEvents[i];
      var el = getEventDom(ev);
      document.getElementById('event-list').appendChild(el);
    }
  }

  function getEventDom(e) {
    var dateString = moment(new Date(e.date)).format(
      'ddd h:mm a'
    );
    var div = document.createElement('div');
    div.className = 'techx-event';
    var b = document.createElement('b');
    b.innerHTML = dateString + ' ';
    div.appendChild(b);
    div.style.marginBottom = '0.5rem';
    div.append(' \u00B7 ' + e.name);
    return div;
  }
  
  return {
    init: initDash
  };
})();

window.addEventListener('load', Dash.init);
