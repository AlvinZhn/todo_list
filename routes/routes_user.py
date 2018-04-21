# -*- coding: utf-8 -*-
"""
@Author: 'Zhang'
"""
from flask import (
	Blueprint,
	request,
	render_template,
	redirect,
	url_for,
	session,
	flash,
)

from models.User import User
from routes import current_user, login_required

user = Blueprint('user', __name__)


@user.route('/login', methods=['POST', 'GET'])
def login():
	session.clear()
	if request.method == 'POST':
		form = request.form
		username = form.get('username')
		password = form.get('password')
		if User.validate_login(username, password):
			u = User.find_by(username=username)
			session['user_id'] = u.id
			returnurl = request.args.get('returnurl')
			flash('You were successfully logged in!', 'success')
			return redirect(returnurl or url_for('main.index'))
		else:
			flash('Invalid username or password!', 'danger')
	u = current_user()
	return render_template('login.html', username=u.username)


@user.route('/register', methods=['POST', 'GET'])
def register():
	if request.method == 'POST':
		form = request.form
		u = User.new(form)
		if u.validate_register():
			return redirect(url_for('.login'))
		else:
			u.remove(id=u.id)
			flash('Username or password less then 2', 'warning')
	return render_template('register.html')


@user.route("/logout")
def logout():
	session.clear()
	flash('Logged Out!', 'info')
	return redirect(url_for("main.index"))


@user.route("/password", methods=["GET", "POST"])
@login_required
def change_pwd():
	if request.method == "POST":
		# ensure old password was submitted
		if not request.form.get("password"):
			flash("Missing old password")
		# ensure password was submitted
		elif not request.form.get("new_password"):
			flash("Missing new password")
		# ensure password was submitted again
		elif not request.form.get("new_password_again"):
			flash("Please provide new password again")
		# ensure two password was same
		elif request.form.get("new_password") != request.form.get("new_password_again"):
			flash("New password don't match")

		# load user pwd info
		if not User.validate_login(current_user().username, request.form.get("password")):
			flash("Wrong Password")

		if request.form.get("password") == request.form.get("new_password"):
			flash("New Password is as same as the old")

		flash("Change password success! Please login again!")

		return redirect(url_for("login"))
	else:
		return render_template("change_pwd.html")


@user.route('/profile')
@login_required
def profile():
	us = User.find_by(username=current_user().username)
	body = render_template(
		'profile.html',
		id=str(getattr(us, 'id')),
		username=current_user().username,
		note=current_user().username
	)
	return body
