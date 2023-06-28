from flask_openapi3 import Info, OpenAPI, APIBlueprint
from flask import redirect, url_for
from flask_cors import CORS
from requests import HTTPError, Response

import os
import re
import importlib

from app.auth import security_schemes

import app.api.pixiv as pix
import app.api.reddit as red
import app.api.twitter as tw
import app.api.pinterest as pin
import app.api.twitter2 as tw2
import app.api.other as other

info = Info(title='SNS-Manager API', version='0.0.1')
app = OpenAPI(__name__, info=info, security_schemes=security_schemes)
app.secret_key = os.getenv('SESSION_SECRET')

origin = '*'
print('CORS origin: ' + origin)
CORS(app, origins=[origin], supports_credentials=True)

api = APIBlueprint('api', __name__, url_prefix='/api')


def _redirect():
    return redirect(url_for("openapi.index"))


@app.errorhandler(HTTPError)
def http_error(error: HTTPError):
    res = error.response
    return res.reason, res.status_code


@app.errorhandler(404)
def page_not_found(e):
    return _redirect()


@app.get('/', doc_ui=False)
def index():
    return _redirect()

api.register_api(pix.api)
api.register_api(red.api)
api.register_api(tw.api)
api.register_api(tw2.api)
api.register_api(pin.api)
api.register_api(other.api)
app.register_api(api)