ORG_NAME = "techx"

from github import Github
from credentials import token

g = Github(token)
org = g.get_organization(ORG_NAME)

def get_commits(num_weeks, debug=False):
    contribs = {}
    images = {}

    print "Fetching From Github ..."

    for repo in org.get_repos(type="all"):
        conts = repo.get_stats_contributors()

        if conts is None:
            continue

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

            if debug:
                print c.author.login, aggr

            images[c.author.login] = c.author.avatar_url

    ordered = []
    for w in sorted(contribs, key=contribs.get, reverse=True):
        if contribs[w] == 0:
            break
        ordered.append({"name": w, "commits": contribs[w], "avatar": images[w]})
    return ordered[:10]