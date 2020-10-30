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


@app.route('/api/register', methods=['POST'])
def register():
    try:
        _id = request.form.get('id', type=str)
        _name = request.form.get('name', type=str)
        _email = request.form.get('email', type=str)
        _password = request.form.get('password', type=str)
        _phonenum = request.form.get('phonenum', type=str)

        # call MySQL
        conn = mysql.connect()
        cursor = conn.cursor()

        msg = {}

        # validate the received values
        if _name and _email and _password and _email and _password and _phonenum:
            # check if user already exists
            cursor.execute('SELECT * FROM users WHERE id=%s', (_id,))
            if len(cursor.fetchall()) != 0:
                msg['info'] = 'error: user already exists!'
                return json.dumps(msg)
            # check if id and name match in the database, get user type
            cursor.execute('SELECT * FROM people WHERE id=%s', (_id,))
            data = cursor.fetchone()
            if len(data) == 0:
                msg['info'] = 'error: id does not exist in school database!!'
                return json.dumps(msg)
            print(str(data[1]))
            if _name != str(data[1]):
                print('tmd')
                msg['info'] = 'error: id and name do not match in school database!!'
                return json.dumps(msg)
            _type = str(data[2])
            # create new user and store in TCPDB
            _hashed_password = generate_password_hash(_password)
            # cursor.callproc('sp_createUser', (_name, _email, _hashed_password))
            cursor.execute('INSERT INTO users(id, name, email, password, phonenum, type) \
                VALUES (%s, %s, %s, %s, %s, %s)', (_id, _name, _email, _hashed_password, _phonenum, _type))
            conn.commit()
            msg['info'] = _type
            msg['name'] = _name
            # msg['type'] = _type
            return json.dumps(msg)

            # data = cursor.fetchall()
            # if len(data) == 0:
            #     conn.commit()
            #     return json.dumps({'message': 'User created successfully !'})
            # else:
            #     return json.dumps({'error': str(data[0])})
        # else:
        #     return json.dumps({'html': '<span>Enter the required fields</span>'})

    except Exception as e:
        print(e)
        return json.dumps({'error': str(e)})
    finally:
        cursor.close()
        conn.close()


@app.route('/login')
def showLogin():
    return render_template('login.html')


@app.route('/api/login', methods=['POST'])
def validateLogin():
    _id = request.form.get('id', type=str)
    _password = request.form.get('password', type=str)
    print(_id)
    print
    # connect to mysql
    conn = mysql.connect()
    cursor = conn.cursor()
    # cursor.callproc('sp_validateLogin', (_username,))
    cursor.execute('SELECT * FROM users WHERE id=%s', (_id,))
    data = cursor.fetchall()
    print(data[0])

    # return to frontend
    msg = {}
    if len(data) > 0:
        if check_password_hash(str(data[0][4]), _password):
            session['user'] = data[0][0]
            msg['info'] = data[0][6]
            msg['name'] = data[0][2]
            # return redirect('/userhome')
        else:
            msg['info'] = 'WRONGPWD'
            # return render_template('error.html', error='Wrong Email address or Password.')
    else:
        msg['info'] = 'NULL'
        # return render_template('error.html', error='Wrong Email address or Password.')

    # except Exception as e:
    #     print(e)
    #     ret['info'] = 'validateLogin error!! check python code or call PSY'
    #     return render_template('error.html', error=str(e))
    # finally:
    cursor.close()
    conn.close()
    return json.dumps(msg)


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
