"""
TCP Package Initializer.
"""

from flaskext.mysql import MySQL
import flask

app = flask.Flask(__name__)
app.config.from_object('TCP.config')
mysql = MySQL()
