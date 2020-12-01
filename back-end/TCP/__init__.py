"""
TCP Package Initializer.
"""

from flaskext.mysql import MySQL
import flask
import os

# app is a single object used by all the code modules in this package
app = flask.Flask(__name__)

# Read settings from config module (TCP/config.py)
app.config.from_object('TCP.config')
mysql = MySQL()
mysql.init_app(app)

# UPLOAD_FOLDER = 'homework'
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER  # set upload folder
# basedir = os.path.abspath(os.path.dirname(__file__))  # get current absolute dir
# ALLOWED_EXTENSIONS = set(['zip', 'pdf', 'txt', 'png', 'jpg', 'xls', 'JPG', 'PNG', 'xlsx', 'gif', 'GIF', 'ppt', 'docx', 'mp4', 'flv'])  # 允许上传的文件后缀

import TCP.api