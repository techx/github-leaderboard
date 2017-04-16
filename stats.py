from github import Github
from credentials import username, password

g = Github(username, password)
org = g.get_organization("techx")

def get_commits(num_weeks):
    contribs = {}
    images = {}

    print "Fetching From Github ..."

    for repo in org.get_repos():
        conts = repo.get_stats_contributors()
        if conts is None:
            continue
        for c in conts:
            aggr = 0
            for w, i in zip(c.weeks, range(len(c.weeks))):
                if i >= num_weeks:
                    break
                aggr += w.c # Count commits
            if c.author.name in contribs:
                contribs[c.author.name] += aggr
            else:
                contribs[c.author.name] = aggr
            images[c.author.name] = c.author.avatar_url

    ordered = []
    for w in sorted(contribs, key=contribs.get, reverse=True):
        ordered.append({"name": w, "commits": contribs[w], "avatar": images[w]})
    return ordered