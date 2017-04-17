# Office Panel and Github Leaderboard

A web application that shows various useful information for the office, like upcoming events and a leaderboard counting the number of Github commits.

<p align="center">
	<img src="http://i.imgur.com/v38vfFu.png" />
</p>

## Deploy

### Credentials
Either grab the `credentials.py` file from the [TechX Google Drive](https://drive.google.com/drive/folders/0B_1TM7HzBrvcTmwzMVQtWi1CN1k?usp=sharing), or follow the instrcutions below.

First create a `credentials.py` in the root directory of the project. The contents of the file look like this:
```python
# Github Token
token = ""

# Calendar
refresh_token = ""
client_id = ""
client_secret = ""
```
#### GitHub
The Github token can be obtained from any account with access to `ORG_NAME` by going to https://github.com/settings/tokens. Make sure to check the `repo` scope while issuing the token.

#### Calendar
The calendar fields can be obtained by first registering an app at the [Google Developer Console](https://console.developers.google.com/). This will give you the `client_id` and `client_secret`.

To obtain a refresh token, add https://developers.google.com/oauthplayground to the list of redirect URI's of your app. Then head over to the [Google OAuth Playground](https://developers.google.com/oauthplayground/), add the `https://www.googleapis.com/auth/calendar.readonly` in the list of scopes and hit Authorize API.

This needs to be done from a google account that has access to the `ORG_NAME` calendar. The click the `Exchange auth code for tokens` button and grab the `refresh_token`

### Running
Execute,
```
pip install -r requirements.txt
```
You may have to use system specific package managers to resolve a few dependancies. (For instance, you need to use fedora's package manager to get six.)

Then run,
```
python app.py
```

This app uses sticky sessions and a persistant background thread and storage. Use appropriate deployment methods.

## License

MIT License
