#!/usr/bin/env python3

# -*- coding: utf-8 -*-
"""
@Author: 'Zhang'
"""

import sys
from os.path import abspath
from os.path import dirname

sys.path.insert(0, abspath(dirname(__file__)))

import server

application = server.app
