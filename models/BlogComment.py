# -*- coding: utf-8 -*-
"""
@Author: 'Zhang'
"""
import time

from models import Model
from models.User import User


class BlogComment(Model):
	"""
	评论类
	"""

	def __init__(self, form, user_id=-1):
		super().__init__(form)
		self.content = form.get('content', '')
		# 和别的数据关联的方式, 用 user_id 表明拥有它的 user 实例
		self.user_id = form.get('user_id', user_id)
		self.username = form.get('username', '游客')
		self.blog_id = int(form.get('blog_id', -1))
		self.created_time = form.get('created_time', 0)
		self.updated_time = form.get('updated_time', 0)

	def user(self):
		u = User.find_by(id=self.user_id)
		return u

	@classmethod
	def new(cls, form):
		t = super().new(form)
		t.created_time = formatted_time(int(time.time()))
		t.updated_time = formatted_time(int(time.time()))
		t.save()
		return t

	@classmethod
	def update(cls, id, form):
		t = BlogComment.find_by(id=id)
		t.title = form.get('title')
		t.updated_time = formatted_time(int(time.time()))
		t.save()
		return t


def formatted_time(unix_time):
	time_format = '%Y/%m/%d %H:%M:%S'
	return time.strftime(time_format, time.localtime(unix_time))
