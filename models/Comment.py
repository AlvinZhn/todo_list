# -*- coding: utf-8 -*-
"""
@Author: 'Zhang'
"""
from models import Model
from models.User import User


class Comment(Model):
	"""
	评论类
	"""

	def __init__(self, form, user_id=-1):
		super().__init__(form)
		self.content = form.get('content', '')
		# 和别的数据关联的方式, 用 user_id 表明拥有它的 user 实例
		self.user_id = form.get('user_id', user_id)
		self.username = form.get('username', '游客')
		self.weibo_id = int(form.get('weibo_id', -1))

	def user(self):
		u = User.find_by(id=self.user_id)
		return u
