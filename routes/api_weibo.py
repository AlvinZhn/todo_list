# -*- coding: utf-8 -*-
"""
@Author: 'Zhang'
"""
from flask import (
	Blueprint,
	jsonify,
	request
)

from models.Comment import Comment
from models.Weibo import Weibo
from routes import current_user, login_required, author_required

weibo_api = Blueprint('weibo_api', __name__)


@weibo_api.route('/api/weibo/all/<username>')
def all(username):
	weibo_list = Weibo.find_all(username=username)
	if weibo_list is not None:
		weibos = Weibo.all_json(weibo_list)
	else:
		weibos = None
	return jsonify(weibos)


@weibo_api.route('/api/weibo/add', methods=['POST'])
@login_required
def add():
	data = request.json
	data['user_id'] = current_user().id
	data['username'] = current_user().username
	w = Weibo.new(data)
	return jsonify(w.json())


@weibo_api.route('/api/weibo/delete')
@author_required
def delete():
	weibo_id = int(request.args.get('id'))
	w = Weibo.remove(weibo_id)
	comments = Comment.find_all(weibo_id=weibo_id)
	for comment in comments:
		Comment.remove(comment.id)
	return jsonify(w.json())


@weibo_api.route('/api/weibo/update', methods=['POST'])
@author_required
def update():
	data = request.json
	weibo_id = int(data.get('id', -1))
	w = Weibo.update(weibo_id, data)
	return jsonify(w.json())
