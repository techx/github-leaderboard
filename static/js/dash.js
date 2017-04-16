var Dash = (function() {
  // config
  var DATE_UPDATE_FREQUENCY = 5000;
  var COMMIT_UPDATE_FREQUENCY = 5 * 60 * 1000;
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
    initCommits();
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
    // TODO
  }

  function initCommits() {
    updateLeaderboard();
    setInterval(updateLeaderboard, COMMIT_UPDATE_FREQUENCY);
  }

  function updateLeaderboard() {
    $.get(
      '/api/panel'
    ).done(function(raw) {
      var data = JSON.parse(raw);
      if ('leaderboard' in data) {
        populateLeaderboard(data.leaderboard);
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
  
  return {
    init: initDash
  };
})();

window.addEventListener('load', Dash.init);
