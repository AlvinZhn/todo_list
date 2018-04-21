# -*- coding: utf-8 -*-
"""
@Author: 'Zhang'
"""
from flask import (
	Blueprint,
	jsonify,
	request,
)

from models.BlogComment import BlogComment
from routes import current_user, login_required, author_required

blogComment_api = Blueprint('blog_comment_api', __name__)


@blogComment_api.route('/api/blogComment/all/<blogId>')
def all(blogId):
	blogComment_list = BlogComment.find_all(blog_id=int(blogId))
	if blogComment_list is not None:
		blog_comments = BlogComment.all_json(blogComment_list)
	else:
		blog_comments = None
	return jsonify(blog_comments)


@blogComment_api.route('/api/blogComment/add', methods=['POST'])
@login_required
def add():
	u = current_user()
	form = request.json
	form['user_id'] = u.id
	form['username'] = u.username
	c = BlogComment.new(form)
	c.save()
	return jsonify(c.json())


@blogComment_api.route('/api/blogComment/delete')
@author_required
def delete():
	print('ha', request)
	print('ha arg', request.args)
	blogComment_id = int(request.args.get('id'))
	c = BlogComment.remove(blogComment_id)
	return jsonify(c.json())


@blogComment_api.route('/api/blogComment/update', methods=['POST'])
@author_required
def update():
	data = request.json
	blogComment_id = int(data.get('id', -1))
	c = BlogComment.find_by(id=blogComment_id)
	c.content = data.get('content')
	c.save()
	return jsonify(c.json())
