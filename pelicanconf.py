#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'Matt, M5MAT'
SITENAME = 'M5MAT'
SITEURL = 'https://m5mat.github.io'

PATH = 'content'

TIMEZONE = 'Europe/London'

DEFAULT_LANG = 'en'

STATIC_PATHS = ['media']

PLUGIN_PATHS = ['plugins']
PLUGINS = ['tipue_search']

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = 'feed/all.xml'
CATEGORY_FEED_ATOM = 'feed/%s.xml'
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Menu
LEFTMENUITEMS = [
    ['About', "/pages/about.html", ''],
    ['Blog', "/category/blog.html", ''],
    ['Contest Reports', "/category/contests.html", ''],
    ['Projects', '/category/projects.html', ''],
    ['Search', '/search.html', '']
]

RIGHTMENUITEMS = [
    ['Feed', "feeds/all.xml", 'fa-rss']
]

CALLSIGNMENU = [
    ['M5MAT', '/pages/m5mat.html'],
    ['2E1HNK', '/pages/2e1hnk.html'],
    ['M0IZZ', '/pages/m0izz.html'],
    ['G2KS', '/pages/g2ks.html'],
    ['GB1WSG', '/pages/gb1wsg.html']
]

TOOLSMENU = [
    ['Satellite Pass Predictor', '/pages/pass-predictor.html']
]

# Blogroll
LINKS = (('Pelican', 'http://getpelican.com/'),
         ('Python.org', 'http://python.org/'),
         ('Jinja2', 'http://jinja.pocoo.org/'),
         ('You can modify those links in your config file', '#'),)

# Social widget
SOCIAL = (('You can add links in your config file', '#'),
          ('Another social link', '#'),)

DEFAULT_PAGINATION = 5

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
