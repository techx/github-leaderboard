CALENDAR_ID = "a9747lo4m7cq0il1ijeqvkv4k8@group.calendar.google.com" # TechX

from credentials import *

import httplib2
import os

from apiclient import discovery
from oauth2client import client, clientsecrets
from oauth2client import tools, GOOGLE_TOKEN_URI, GOOGLE_REVOKE_URI
from oauth2client.file import Storage

import datetime
def get_events():
    credentials = client.OAuth2Credentials(
    None, client_id, client_secret, refresh_token, None, GOOGLE_TOKEN_URI,
    None, revoke_uri=GOOGLE_REVOKE_URI)

    # refresh the access token (or just try using the service)
    credentials.refresh(httplib2.Http())
    http = credentials.authorize(httplib2.Http())
    service = discovery.build('calendar', 'v3', http=http)

    now = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
    eventsResult = service.events().list(
        calendarId=CALENDAR_ID, timeMin=now, maxResults=10, singleEvents=True,
        orderBy='startTime').execute()

    events = eventsResult.get('items', [])

    ret = []

    for event in events:
        start = event['start'].get('dateTime', event['start'].get('date'))
        ret.append({"date": start, "name": event['summary']})

    return ret
if __name__ == "__main__":
    print get_events()
