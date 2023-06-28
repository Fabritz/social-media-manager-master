from flask_openapi3 import HTTPBase, HTTPBearer
from flask import request, redirect, session
from app.model import ErrorMessage
from functools import wraps
import urllib.parse as url
import json

security_schemes = {'basic': HTTPBase(), 'jwt': HTTPBearer()}

basic_security = [{'basic': []}]

jwt_security = [{'jwt': []}]


def jwt_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('authorization')
        if not token and request.method != 'OPTION':
            return ErrorMessage(message='Missing JWT token').dict(), 401

        return f(token=token.split(' ')[-1], *args, **kwargs)

    return decorated


def basic_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user = request.authorization.username
        pw = request.authorization.password

        if (not user or not pw) and request.method != 'OPTION':
            return ErrorMessage(message='Missing username or password').dict(), 401

        return f(user=user, password=pw, *args, **kwargs)

    return decorated


SESSION_REDIRECT = 'RETURN_TO'


def redirect_or_return(token_key: str, data: dict):
    redirect_url = session[SESSION_REDIRECT]

    if redirect_url:
        session[SESSION_REDIRECT] = None
        query = {}
        query[token_key] = json.dumps(data)
        return redirect(f'{redirect_url}?{url.urlencode(query)}')

    return data
