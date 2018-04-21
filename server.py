# -*- coding: utf-8 -*-
"""
@Author: 'Zhang'
"""
from flask import Flask, render_template
from flask_session import Session
import config

from routes.routes_todo import todo_view
from routes.api_todo import todo_api
from routes.routes_weibo import weibo_view
from routes.api_weibo import weibo_api
from routes.api_comment import comment_api
from routes.routes_blog import blog_view
from routes.api_blog import blog_api
from routes.api_blogComment import blogComment_api
from routes.routes_static import main as index_view
from routes.routes_user import user
from routes.routes_admin import admin

app = Flask(__name__)

# load config from config file
app.config.from_object(config)
Session(app)

# auto reload jinja
app.jinja_env.auto_reload = True

app.register_blueprint(todo_view)
app.register_blueprint(todo_api)
app.register_blueprint(weibo_view)
app.register_blueprint(weibo_api)
app.register_blueprint(comment_api)
app.register_blueprint(blog_view)
app.register_blueprint(blog_api)
app.register_blueprint(blogComment_api)
app.register_blueprint(index_view)
app.register_blueprint(user)
app.register_blueprint(admin)


@app.errorhandler(404)
def error(e):
	return render_template('404.html'), 404


if __name__ == '__main__':
	config = dict(
		host='0.0.0.0',
		port=3000,
	)
	app.run(**config)
