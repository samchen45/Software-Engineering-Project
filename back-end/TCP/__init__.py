"""
TCP Package Initializer.
"""

from flaskext.mysql import MySQL
import flask

# app is a single object used by all the code modules in this package
app = flask.Flask(__name__)

# Read settings from config module (TCP/config.py)
app.config.from_object('TCP.config')


# session secret key. KEEP THIS SECRET!!
app.secret_key = 'dalab5216'

mysql = MySQL()
mysql.init_app(app)


# Tell our app about views (and possibly model).  This is dangerously close to a
# circular import, which is naughty, but Flask was designed that way.
# (Reference http://flask.pocoo.org/docs/patterns/packages/)  We're
# going to tell pylint and pycodestyle to ignore this coding style violation.
import TCP.api  # noqa: E402  pylint: disable=wrong-import-position
