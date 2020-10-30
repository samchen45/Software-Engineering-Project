"""
URLs include:
/
/login
/register
"""

from flask import Flask, render_template, json, request, redirect, session
from flaskext.mysql import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
import json

mysql = MySQL()
app = Flask(__name__)
app.secret_key = 'secret'

# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'TCPAdmin'
app.config['MYSQL_DATABASE_PASSWORD'] = 'password'
app.config['MYSQL_DATABASE_DB'] = 'TCPDB'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)


@app.route('/')
def showIndex():
    return render_template('index.html')


@app.route('/register')
def showRegister():
    return render_template('register.html')


@app.route('/signUp', methods=['POST', 'GET'])
def signUp():
    try:
        _name = request.form['inputName']
        _email = request.form['inputEmail']
        _password = request.form['inputPassword']

        # call MySQL
        conn = mysql.connect()
        cursor = conn.cursor()
        # validate the received values
        if _name and _email and _password:
            _hashed_password = generate_password_hash(_password)
            cursor.callproc('sp_createUser', (_name, _email, _hashed_password))
            data = cursor.fetchall()

            if len(data) == 0:
                conn.commit()
                return json.dumps({'message': 'User created successfully !'})
            else:
                return json.dumps({'error': str(data[0])})
        else:
            return json.dumps({'html': '<span>Enter the required fields</span>'})

    except Exception as e:
        return json.dumps({'error': str(e)})
    finally:
        cursor.close()
        conn.close()


@app.route('/login')
def showLogin():
    return render_template('login.html')


@app.route('/validateLogin', methods=['POST', 'GET'])
def validateLogin():
    try:
        # print(request.args.get('username', type=str))
        _username = request.args.get('username', type=str)
        _password = request.args.get('password', type=str)

        # connect to mysql
        conn = mysql.connect()
        cursor = conn.cursor()
        cursor.callproc('sp_validateLogin', (_username,))
        data = cursor.fetchall()

        ret = {}

        if len(data) > 0:
            if check_password_hash(str(data[0][4]), _password):
                session['user'] = data[0][0]
                # return to frontend
                ret['info'] = data[0][6]
                # return redirect('/userhome')
                return josn.dumps(ret)
            else:
                ret['info'] = 'WRONGPWD'
                return json.dumps(ret)
                # return render_template('error.html', error='Wrong Email address or Password.')
        else:
            ret['info'] = 'NULL'
            return json.dumps(ret)
            # return render_template('error.html', error='Wrong Email address or Password.')

    except Exception as e:
        return render_template('error.html', error=str(e))
    finally:
        cursor.close()
        conn.close()


@app.route('/userhome')
def showUserHome():
    if session.get('user'):
        return render_template('userHome.html')
    else:
        return render_template('userhome.html')


@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/')


if __name__ == "__main__":
    app.run(port=5002)
