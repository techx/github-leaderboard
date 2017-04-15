PORT = 80
GITHUB_POLL_TIMER = 60 # seconds

import greenclock
from flask import Flask
from stats import *

app = Flask(__name__)

def GithubPoller():
	pass

@app.route("/")
def hello():
	return "Hello World!"

if __name__ == "__main__":
	scheduler = greenclock.Scheduler(logger_name='task_scheduler')
	scheduler.schedule('GithubPollTask', greenclock.every_second(GITHUB_POLL_TIMER), GithubPoller)
	app.run(host="0.0.0.0", port=80, debug=True)