from stats import *

if __name__ == "__main__":
	commits = get_commits(2)[:10]
	for commit in commits:
		print commit