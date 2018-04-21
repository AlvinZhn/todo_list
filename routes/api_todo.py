# -*- coding: utf-8 -*-
"""
@Author: 'Zhang'
"""
from flask import (
	Blueprint,
	jsonify,
	request
)

from models.Todo import Todo
from routes import current_user

todo_api = Blueprint('todo_api', __name__)


@todo_api.route('/api/todo/all')
def all():
	u = current_user()
	todo_list = Todo.find_all(user_id=u.id)
	if todo_list is not None:
		todos = Todo.all_json(todo_list)
		return jsonify(todos)


@todo_api.route('/api/todo/add', methods=['POST'])
def add():
	form = request.json
	if len(form['title']) > 0:
		form['user_id'] = current_user().id
		t = Todo.new(form)
		return jsonify(t.json())


@todo_api.route('/api/todo/delete')
def delete():
	u = current_user()
	todo_id = int(request.args.get('id'))
	todo = Todo.find_by(id=todo_id)
	if todo.user_id == u.id:
		t = Todo.remove(todo_id)
		return jsonify(t.json())


@todo_api.route('/api/todo/update', methods=['POST'])
def update():
	form = request.json
	todo_id = int(form.get('id', -1))
	if len(form) > 0:
		t = Todo.update(todo_id, form)
		return jsonify(t.json())
