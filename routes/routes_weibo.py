# -*- coding: utf-8 -*-
"""
@Author: 'Zhang'
"""
from flask import (
	Blueprint,
	render_template,
	redirect,
)

from routes import current_user, login_required

weibo_view = Blueprint('weibo_view', __name__)


@weibo_view.route('/weibo')
@login_required
def index():
	user = current_user()
	if user.id == -1:
		return redirect('/login')
	else:
		return redirect('/weibo/{}'.format(user.username))


@weibo_view.route('/weibo/<username>')
def user_index(username):
	body = render_template('weibo_index.html', username=username)
	return body
