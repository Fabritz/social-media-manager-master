import requests as req
import os
import json
from dotenv import load_dotenv
from argparse import ArgumentParser
from shared import build_images, refresh_token, BASE_URL

REDDIT_API = 'https://oauth.reddit.com'

load_dotenv()

parser = ArgumentParser()
parser.add_argument('command', type=str)  # enviar, suprimir
parser.add_argument('--title')
parser.add_argument('--text')
parser.add_argument('-i', '--images', nargs='+', default=[])
parser.add_argument('-sr', '--subreddits', nargs='+', default=[],
                    help='subreddits a publicar, nombre o nombre con estilo separados por dos puntos')

parser.add_argument('--refresh', default=False, action='store_true')

args = parser.parse_args()

token = os.getenv('REDDIT_TOKEN')
if args.refresh:
    refresh = os.getenv('REDDIT_REFRESH')
    token = refresh_token('reddit', refresh)

reddit_header = {'Authorization': f'Bearer {token}'}


def submit():
    files = build_images(args.images)
    for sr in args.subreddits:
        split = sr.split(':')
        subreddit = split[0]
        flair = split[1] if len(split) > 1 else None

        data = {
            'title': args.title,
            'text': args.text,
            'subreddit': subreddit,
            'flair': flair,
        }
        res = req.post(f'{BASE_URL}/reddit/post', data=data,
                       files=files, headers=reddit_header)
        print(f'{res.status_code}: {res.text}')


def delete_all():
    print('DELETE ALL')



cmd_map = {
    'submit': submit,
    'delete': delete_all,
}

cmd_map.get(args.command)()
