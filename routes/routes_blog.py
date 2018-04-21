# -*- coding: utf-8 -*-
"""
@Author: 'Zhang'
"""
from flask import (
	render_template,
	Blueprint,
	redirect)

from routes import current_user, login_required

blog_view = Blueprint('blog_view', __name__)


@blog_view.route('/blog')
@login_required
def index():
	user = current_user()
	if user.id == -1:
		return redirect('/login')
	else:
		return redirect('/blog/{}'.format(user.username))


@blog_view.route('/blog/<username>')
def user_index(username):
	body = render_template('blog_index.html', username=username)
	return body


@blog_view.route('/blog/new')
@login_required
def new():
	return render_template('blog_new.html')


@blog_view.route('/blog/detail')
@login_required
def detail():
	return render_template('blog_detail.html')
