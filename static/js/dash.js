var Dash = (function() {
  // config
  var DATE_UPDATE_FREQUENCY = 5000;
  var COMMIT_UPDATE_FREQUENCY = 10*1000;

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
    // setInterval(updateLeaderboard, COMMIT_UPDATE_FREQUENCY);
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
    leaders.forEach(function(leader) {
      var li = document.createElement('li'); 
      var username = document.createElement('span'); 
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
    });
  }
  
  return {
    init: initDash
  };
})();

window.addEventListener('load', Dash.init);
