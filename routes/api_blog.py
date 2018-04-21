# -*- coding: utf-8 -*-
"""
@Author: 'Zhang'
"""
from flask import (
	Blueprint,
	jsonify,
	request,
	url_for,
)

from models.Blog import Blog
from models.BlogComment import BlogComment
from routes import current_user, login_required, author_required

blog_api = Blueprint('blog_api', __name__)


@blog_api.route('/api/blog/all/<username>')
def all(username):
	weibo_list = Blog.find_all(username=username)
	if weibo_list is not None:
		weibos = Blog.all_json(weibo_list)
	else:
		weibos = None
	return jsonify(weibos)


@blog_api.route('/api/blog/detail')
@login_required
def detail():
	blog_id = int(request.args.get('id'))
	b = Blog.find_by(id=blog_id)
	return jsonify(b.json())


@blog_api.route('/api/blog/add', methods=['POST'])
@login_required
def add():
	form = request.get_json()
	form['user_id'] = current_user().id
	form['username'] = current_user().username
	b = Blog.new(form)
	response = b.json()
	response['redirect'] = url_for('blog_view.index')
	return jsonify(response)


@blog_api.route('/api/blog/delete')
@author_required
def delete():
	blog_id = int(request.args.get('id'))
	b = Blog.remove(blog_id)

	blogComments = BlogComment.find_all(blog_id=blog_id)
	for blogComment in blogComments:
		BlogComment.remove(blogComment.id)

	return jsonify(b.json())


@blog_api.route('/api/blog/update', methods=['POST'])
def update():
	form = request.json
	blog_id = int(form.get('id', -1))
	if len(form) > 0:
		b = Blog.update(blog_id, form)
		return jsonify(b.json())
