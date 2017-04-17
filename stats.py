ORG_NAME = "techx"

from github import Github
from credentials import token

g = Github(token)
org = g.get_organization(ORG_NAME)

def get_commits(num_weeks, debug=False, limit=20):
    total_repos = org.public_repos + org.total_private_repos

    print "Fetching From Github ({count}) ...".format(count=total_repos)
    count = 0

    while not count == total_repos:
        contribs = {}
        images = {}

        all_time = {}
        for repo in org.get_repos(type="all"):
            conts = None

            while conts is None:
                conts = repo.get_stats_contributors()
            count += 1

            if debug:
                print ""
                print repo.name

            for c in conts:
                aggr = 0
                weeks = sorted(c.weeks, key=lambda w: w.w, reverse=True)

                if debug:
                    print weeks[0].w

                for w, i in zip(weeks, range(len(weeks))):
                    if i >= num_weeks:
                        break
                    aggr += w.c # Count commits
                if c.author.login in contribs:
                    contribs[c.author.login] += aggr
                else:
                    contribs[c.author.login] = aggr

                aggr = 0
                for w in weeks:
                    aggr += w.c

                if c.author.login in all_time:
                    all_time[c.author.login] += aggr
                else:
                    all_time[c.author.login] = aggr

                if debug:
                    print c.author.login, aggr

                images[c.author.login] = c.author.avatar_url

        ordered_week = []
        for w in sorted(contribs, key=contribs.get, reverse=True):
            if contribs[w] == 0:
                break
            ordered_week.append({"name": w, "commits": contribs[w], "avatar": images[w]})

        ordered_alltime = []
        for w in sorted(all_time, key=all_time.get, reverse=True):
            if all_time[w] == 0:
                break
            ordered_alltime.append({"name": w, "commits": all_time[w], "avatar": images[w]})

        return {"week": ordered_week[:limit], "all_time": ordered_alltime[:limit]}

if __name__ == "__main__":
    commits = get_commits(2)['week'][:10]
    for commit in commits:
        print commit