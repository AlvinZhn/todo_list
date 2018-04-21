# -*- coding: utf-8 -*-
"""
@Author: 'Zhang'
"""
from flask import (
	request,
	Blueprint,
	render_template,
	send_file,
	abort
)

from models.Message import Message
from routes import current_user
from utils import log

main = Blueprint('main', __name__)


@main.route('/')
def index():
	log('Access info: \nHost: {} \nPath: {} \nUser-Agent: {}\r\n'.format(request.remote_addr, request.full_path,
																		 request.user_agent))
	return render_template("index.html", username=current_user().username)


@main.route('/messages')
def message():
	data = request.args
	if len(data) > 0:
		Message.new(data)
	body = render_template('message.html', messages=Message.all())
	return body


@main.route('/messages/add', methods=['POST'])
def message_add():
	data = request.form
	if len(data) > 0:
		Message.new(data)
	body = render_template('message.html', messages=Message.all())
	return body


@main.route('/files/<name>')
def static(name):
	path = 'files/' + name
	try:
		return send_file(
			'{}'.format(path),
			attachment_filename='{}'.format(name)
		)
	except Exception:
		return abort(404)
	finally:
		log('\nHost: {} \nTry to get file: {}\r\n'.format(request.remote_addr, name))


@main.route('/coming-soon')
def coming_soon():
	return render_template('404.html'), 200
