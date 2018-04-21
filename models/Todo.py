# -*- coding: utf-8 -*-
"""
@Author: 'Zhang'
"""
import time

from models import Model
from utils import log


class Todo(Model):
	def __init__(self, form):
		super().__init__(form)
		self.title = form.get('title', '')
		self.user_id = form.get('user_id', -1)
		self.created_time = form.get('created_time', 0)
		self.updated_time = form.get('updated_time', 0)

	@classmethod
	def new(cls, form):
		t = super().new(form)
		t.created_time = formatted_time(int(time.time()))
		t.updated_time = formatted_time(int(time.time()))
		t.save()
		return t

	@classmethod
	def update(cls, id, form):
		t = Todo.find_by(id=id)
		t.title = form.get('title')
		t.updated_time = formatted_time(int(time.time()))
		t.save()
		return t


def formatted_time(unix_time):
	time_format = '%Y/%m/%d %H:%M:%S'
	return time.strftime(time_format, time.localtime(unix_time))
