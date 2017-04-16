PORT = 80
GITHUB_POLL_TIMER = 60 # seconds
STORE = "private/leaderboard_cache.p"
NUM_WEEKS = 1 # show leaderboard for 1 week, TO-DO: make this configurable from the front-end

import greenclock
import json
from flask import Flask, render_template
from stats import *

app = Flask(__name__)

def get_leaderboard():
    return get_commits(NUM_WEEKS)

leaderboard = get_leaderboard()

def GithubPoller():
    global leaderboard
    leaderboard = get_leaderboard()

@app.route("/api/panel")
def meta_api():
    return json.dumps({
            "leaderboard": leaderboard
        })

@app.route("/")
def main_panel():
    return render_template("panel.html")

if __name__ == "__main__":
    scheduler = greenclock.Scheduler(logger_name='task_scheduler')
    scheduler.schedule('GithubPollTask', greenclock.every_second(GITHUB_POLL_TIMER), GithubPoller)
    app.run(host="0.0.0.0", port=80, debug=False)