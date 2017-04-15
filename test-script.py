from github import Github
from credentials import username, password

g = Github(username, password)
org = g.get_organization("techx")

contribs = {}

for repo in org.get_repos():
	conts = repo.get_stats_contributors()
	if conts is None:
		continue
	print repo.name
	for c in conts:
		aggr = 0
		for w in c.weeks:
			aggr += w.a + w.d
		print c.author.name, aggr
		if c.author.name in contribs:
			contribs[c.author.name] += aggr
		else:
			contribs[c.author.name] = aggr
	print ""

for w in sorted(contribs, key=contribs.get, reverse=True):
	print w, contribs[w]