# -*- coding: utf-8 -*-
"""
@Author: 'Zhang'
"""
from flask import (
	Blueprint,
	jsonify,
	request,
)

from models.Comment import Comment
from routes import current_user, login_required, author_required

comment_api = Blueprint('comment_api', __name__)


@comment_api.route('/api/comment/all')
def all():
	comment_list = Comment.all()
	if comment_list is not None:
		comments = Comment.all_json(comment_list)
		return jsonify(comments)


@comment_api.route('/api/comment/add', methods=['POST'])
@login_required
def add():
	u = current_user()
	form = request.json
	form['user_id'] = u.id
	form['username'] = u.username
	c = Comment.new(form)
	c.save()
	return jsonify(c.json())


@comment_api.route('/api/comment/delete')
@author_required
def delete():
	comment_id = int(request.args.get('id'))
	c = Comment.remove(comment_id)
	return jsonify(c.json())


@comment_api.route('/api/comment/update', methods=['POST'])
@author_required
def update():
	data = request.json
	comment_id = int(data.get('id', -1))
	c = Comment.find_by(id=comment_id)
	c.content = data.get('content')
	c.save()
	return jsonify(c.json())
