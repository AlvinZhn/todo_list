# -*- coding: utf-8 -*-
"""
@Author: 'Zhang'
"""
from flask import (
    render_template,
    Blueprint,
)

from routes import current_user, login_required

todo_view = Blueprint('todo_view', __name__)


@todo_view.route('/todo')
@login_required
def index():
    body = render_template('todo_index.html', username=current_user().username)
    return body
