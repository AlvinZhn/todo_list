# -*- coding: utf-8 -*-
"""
@Author: 'Zhang'
"""
from functools import wraps

from flask import (
	redirect,
	session,
	url_for,
	request,
)

from models.Blog import Blog
from models.BlogComment import BlogComment
from models.Comment import Comment
from models.User import User
from models.Weibo import Weibo
from utils import log


def current_user():
	user_id = int(session.get('user_id', -1))
	if user_id is not -1:
		u = User.find_by(id=user_id)
		return u
	else:
		return User.guest()


def login_required(f):
	"""
	Decorate routes to require login.
	http://flask.pocoo.org/docs/0.11/patterns/viewdecorators/
	"""

	@wraps(f)
	def decorated_function(*args, **kwargs):
		if session.get("user_id") is None:
			return redirect(url_for("user.login", returnurl=request.url))
		return f(*args, **kwargs)

	return decorated_function


def author_required(f):
	@wraps(f)
	def decorated_function(*args, **kwargs):
		u = current_user()
		model_name = request.path.split('/')[-2]
		# 根据不同请求方法，获取实例的 id
		if request.method == 'POST':
			data = request.json
			id = int(data.get('id'))
		else:
			id = int(request.args.get('id'))
		# 根据 model 的名字，判断从哪里获取实例
		path_dict = dict(
			weibo=Weibo.find_by(id=id),
			comment=Comment.find_by(id=id),
			blog=Blog.find_by(id=id),
			blogComment=BlogComment.find_by(id=id),
		)
		instance = path_dict.get(model_name)
		user_id = instance.user_id
		# 检查登录用户 id 与实例的 user_id 是否一致
		if u.id == user_id:
			return f(*args, **kwargs)
		else:
			log("{} try to access {}'s data\r\n".format(u.username, instance.username))
			return redirect('#')

	return decorated_function
