# -*- coding: utf-8 -*-
"""
@Author: 'Zhang'
"""
from flask import (
	Blueprint,
	request,
	render_template,
	session,
	url_for,
	redirect,
	flash,
)

from models.User import User, salted_password

admin = Blueprint('admin', __name__)


@admin.route('/admin/user')
def users():
	"""
	只有 id 为 1 的用户可以访问这个页面, 其他用户访问会定向到 /login
	"""
	if session.get('user_id') == 1 or session.get('user_id') == 2:
		return render_template('admin_users.html', user_list=User.all())
	else:
		flash('Admin User Required! Here is your profile...', 'danger')
		return redirect(url_for('user.profile'))


@admin.route('/admin/update', methods=['GET', 'POST'])
def update():
	"""
	类似于update函数，处理在 /admin/users 下提交的表单，修改指定用户 id 的密码
	"""
	if session.get('user_id') == 1 or session.get('user_id') == 2:
		if request.method == 'POST':
			user_id = request.form.get('id')
			if len(user_id) > 0:
				us = User.find_by(id=int(user_id))
				if us is not None:
					password = request.form.get('password')
					if len(password) < 3:
						flash('密码长度必须大于2')
					else:
						us.password = salted_password(password)
						us.save()
						return redirect(url_for('.users'))
				else:
					flash('id不存在')
			else:
				flash('Invalid Input')
		return render_template('admin_users.html', user_list=User.all())
	else:
		flash('Admin User Required! Here is your profile...', 'danger')
		return redirect(url_for('user.profile'))
