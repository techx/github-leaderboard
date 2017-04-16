## Config

PORT = 8000
GITHUB_POLL_TIMER = 600 # seconds
STORE = "private/leaderboard_cache.p"
NUM_WEEKS = 2 # show leaderboard for 2 weeks, TO-DO: make this configurable from the front-end
NUM_EVENTS = 2 

## Init
import schedule
import time
import json
import pickle
import os
import threading
from flask import Flask, render_template
from stats import *
from calendar_helper import *

app = Flask(__name__)

# Returns the leaderboard from GitHub
def get_leaderboard():
    ret = get_commits(NUM_WEEKS)
    with open(STORE, "wb") as file:
        pickle.dump(ret, file)

    return ret

# Load it from cached copy stored
def read_leaderboard():
    global leaderboard
    with open(STORE, "rb") as file:
        leaderboard = pickle.load(file)

# Startup
if os.path.exists(STORE):
    read_leaderboard()
else:
    leaderboard = get_leaderboard()

# Scheduled poller
def GithubPoller():
    global leaderboard
    leaderboard = get_leaderboard()

# From https://github.com/mrhwick/schedule/blob/master/schedule/__init__.py
def run_scheduler_cont():
    cease_continuous_run = threading.Event()

    class ScheduleThread(threading.Thread):
        @classmethod
        def run(cls):
            while not cease_continuous_run.is_set():
                schedule.run_pending()
                time.sleep(10)

    continuous_thread = ScheduleThread()
    continuous_thread.start()
    return cease_continuous_run

## Routes

@app.route("/api/panel")
def meta_api():
    return json.dumps({
            "leaderboard": leaderboard,
            "events": get_events()[:NUM_EVENTS]
        })

@app.route("/")
def main_panel():
    return render_template("main.html")


## Main
if __name__ == "__main__":
    schedule.every(GITHUB_POLL_TIMER).seconds.do(GithubPoller)
    run_scheduler_cont()
    app.run(host="0.0.0.0", port=PORT, debug=False)
