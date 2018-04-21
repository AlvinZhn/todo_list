# -*- coding: utf-8 -*-
"""
@Author: 'Zhang'
"""
import time

from models import Model
from models.Comment import Comment


class Weibo(Model):
	def __init__(self, form):
		super().__init__(form)
		self.content = form.get('content', '')
		self.user_id = form.get('user_id', -1)
		self.username = form.get('username', '游客')
		self.created_time = form.get('created_time', 0)
		self.updated_time = form.get('updated_time', 0)

	@classmethod
	def new(cls, form):
		w = super().new(form)
		w.created_time = formatted_time(int(time.time()))
		w.updated_time = formatted_time(int(time.time()))
		w.save()
		return w

	@classmethod
	def update(cls, id, form):
		w = Weibo.find_by(id=id)
		w.content = form.get('content')
		w.updated_time = formatted_time(int(time.time()))
		w.save()
		return w

	def comments(self):
		return Comment.find_all(weibo_id=self.id)


def formatted_time(unix_time):
	time_format = '%Y/%m/%d %H:%M:%S'
	return time.strftime(time_format, time.localtime(unix_time))
