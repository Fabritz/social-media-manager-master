from flask import session, request, redirect
from flask_openapi3 import APIBlueprint, Tag
from nanoid import generate
import requests as req
import urllib.parse as url
import os

from app.model import OAuthToken, RefreshToken, ErrorMessage, Token, AuthQuery
from app.config import REDDIT_USER_AGENT, reddit_tag
from app.auth import SESSION_REDIRECT, redirect_or_return

auth_api = APIBlueprint('reddit_auth', __name__,
                        url_prefix='/auth', abp_tags=[reddit_tag])

REDDIT_TOKEN_URL = 'https://www.reddit.com/api/v1/access_token'
REDDIT_REVOKE_URL = 'https://www.reddit.com/api/v1/revoke_token'
SESSION_STATE = 'REDDIT_STATE'


def _client(): return os.getenv('REDDIT_CLIENT')
def _secret(): return os.getenv('REDDIT_SECRET')


headers = {
    'User-Agent': REDDIT_USER_AGENT,
}


def _redirect_url():
    return url.urljoin(request.base_url, 'callback')


@auth_api.get('/', responses={'302': None})
def reddit_auth(query: AuthQuery):
    """ Redirige al inicio de sesión de reddit """
    state = generate()
    scopes = [
        'identity',
        'edit',
        'structuredstyles',
        'read',
        'submit',
        'flair',
        'history',
    ]

    query_str = url.urlencode({
        'client_id': _client(),
        'response_type': 'code',
        'state': state,
        'redirect_uri': _redirect_url(),
        'duration': 'permanent',
        'scope': ' '.join(scopes),
    })

    session[SESSION_STATE] = state
    session[SESSION_REDIRECT] = query.return_to
    return redirect(f'https://www.reddit.com/api/v1/authorize?{query_str}')


def _basic_auth():
    return req.auth.HTTPBasicAuth(_client(), _secret())


def _get_access_token(data: dict):
    res = req.post(REDDIT_TOKEN_URL, data=data,
                   auth=_basic_auth(), headers=headers)
    res.raise_for_status()

    token_data = res.json()
    return OAuthToken(access_token=token_data['access_token'],
                      refresh_token=token_data['refresh_token'], expires_in=token_data['expires_in'])


@auth_api.get('/callback', responses={'200': OAuthToken, '400': ErrorMessage})
def reddit_auth_callback():
    """ Llamada después del inicio de sesión para obtener el token de acceso"""
    query = request.args

    if 'error' in query:
        return ErrorMessage(message=query['error']).dict(), 400

    if query['state'] != session[SESSION_STATE]:
        return ErrorMessage(message='Invalid state').dict(), 400

    token = _get_access_token({
        'grant_type': 'authorization_code',
        'code': query['code'],
        'redirect_uri': _redirect_url(),
    })
    return redirect_or_return('reddit', token.dict())


@auth_api.post('/refresh', responses={'200': OAuthToken})
def reddit_refresh(body: RefreshToken):
    """ Obtener un nuevo token de acceso utilizando el token de actualización """
    token = _get_access_token({
        'grant_type': 'refresh_token',
        'refresh_token': body.refresh_token,
    })
    return token.dict()


@auth_api.post('/revoke', responses={'200': None})
def reddit_revoke(body: Token):
    """ Revocar un token de acceso o de actualizacion """
    data = {'token': body.token}
    res = req.post(REDDIT_REVOKE_URL, data=data,
                   auth=_basic_auth(), headers=headers)
    res.raise_for_status()

    return ''
