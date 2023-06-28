import tweepy as tw
from flask_openapi3 import FileStorage
from io import BufferedReader


class TwitterClient:
    def __init__(self, client: str, secret: str, a_token: str = '', a_secret: str = ''):
        auth = tw.OAuth1UserHandler(client, secret, a_token, a_secret)
        app = tw.OAuth2AppHandler(client, secret)
        self.api = tw.API(auth)
        self.apiApp = tw.API(app)
        self.api2 = tw.Client(access_token=a_token,
                              access_token_secret=a_secret,
                              consumer_key=client,
                              consumer_secret=secret)

    def user(self):
        return self.api2.get_me().data

    def tweet(self, text: str, images: [FileStorage]):
        print(f'----- Start tweeting -----')

        ids = []
        for image in images:
            image.name = image.filename
            res = self.api.media_upload(filename=image.filename,
                                        file=BufferedReader(image))
            ids.append(res.media_id)

        status = self.api.update_status(
            status=text, media_ids=ids)

        print(f'----- Finish tweeting -----')
        return status.id_str

    def list_tweets(self, username: str, last_id=None, first_id=None, count=40):
        max_id = int(last_id) - 1 if last_id is not None else None
        since_id = int(first_id) + 1 if first_id is not None else None
        return self.apiApp.user_timeline(screen_name=username, max_id=max_id, since_id=since_id, count=count, include_rts=False, exclude_replies=True, trim_user=True)
