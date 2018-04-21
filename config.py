# -*- coding: utf-8 -*-
"""
@Author: 'Zhang'
"""
# 关闭 js 静态缓存
SEND_FILE_MAX_AGE_DEFAULT = 0

# 自动 reload jinja
TEMPLATES_AUTO_RELOAD = True

# configure session to use filesystem (instead of signed cookies)
SESSION_TYPE = "filesystem"
SESSION_PERMANENT = False

DEBUG = True

SECRET_KEY = "\xf6\xd7K|$\x12\x07\xad\x8e\x10]\xe7\x1b\xc0\x0c\x13`\xb28o\xefB\xef\x8f"
