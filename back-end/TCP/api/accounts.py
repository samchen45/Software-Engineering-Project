from flask import json, request
from werkzeug.security import generate_password_hash, check_password_hash
import TCP
import TCP.utils as utils


@TCP.app.route('/api/register', methods=['POST'])
def register():
    try:
        _id = request.form.get('id', type=str)
        _name = request.form.get('name', type=str)
        _email = request.form.get('email', type=str)
        _password = request.form.get('password', type=str)
        _phonenum = request.form.get('phonenum', type=str)

        # call MySQL
        conn = TCP.mysql.connect()
        cursor = conn.cursor()

        msg = {}

        # validate the received values
        if _id and _email and _password and _name and _phonenum:
            # check if user already exists
            cursor.execute('SELECT * FROM users WHERE id=%s', (_id,))
            if len(cursor.fetchall()) != 0:
                msg['info'] = 'error: user already exists!'
                return json.dumps(msg)
            # # check if id and name match in the database, get user type
            # cursor.execute('SELECT * FROM people WHERE id=%s', (_id,))
            # data = cursor.fetchone()
            # if not data:
            #     msg['info'] = 'error: id does not exist in school database!!'
            #     return json.dumps(msg)
            # if _name != str(data[1]):
            #     msg['info'] = 'error: id and name do not match in school database!!'
            #     return json.dumps(msg)
            # _type = str(data[2])
            # # send email captcha
            # code = utils.send_email_captcha(_email)
            # verify email captcha
            #TODO
            # _code = request.form.get('code', type=int)
            # if code != _code:
            #     msg['info'] = 'ERROR: wrong verification code!! Please check again.'
            #     return json.dumps(msg)

            _type = 'S' # 暂时先这样

            # create new user and store in TCPDB
            _hashed_password = generate_password_hash(_password)
            # cursor.callproc('sp_createUser', (_name, _email, _hashed_password))
            cursor.execute('INSERT INTO users(id, uname, email, upassword, phonenum, utype) \
                VALUES (%s, %s, %s, %s, %s, %s)', (_id, _name, _email, _hashed_password, _phonenum, _type))
            conn.commit()
            msg['info'] = _type
            msg['name'] = _name
            return json.dumps(msg)

    except Exception as e:
        print(e)
        return json.dumps({'error': str(e)})
    finally:
        cursor.close()
        conn.close()


@TCP.app.route('/api/login', methods=['POST'])
def login():
    _id = request.form.get('id', type=str)
    _password = request.form.get('password', type=str)
    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()
    # cursor.callproc('sp_validateLogin', (_username,))
    cursor.execute('SELECT * FROM users WHERE id=%s', (_id,))
    data = cursor.fetchall()

    # return to frontend
    msg = {}
    if data:
        if check_password_hash(str(data[0][4]), _password):
            # session['user'] = data[0][0]
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


@TCP.app.route('/api/updateinfo', methods=['POST'])
def updateInfo():
    # get parameters from request
    _id = request.form.get('id', type=str)
    _name = request.form.get('name', type=str)
    _email = request.form.get('email', type=str)
    _password = request.form.get('password', type=str)
    _password_new = request.form.get('password_new', type=str)
    _phonenum = request.form.get('phonenum', type=str)
    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE id=%s', (_id,))
    data = cursor.fetchone()

    msg = {}
    # if user not found
    if len(data) == 0:
        msg['info'] = 'NULL'
        cursor.close()
        conn.close()
        return json.dumps(msg)
    if check_password_hash(str(data[4]), _password):
        # update info
        _hashed_password_new = generate_password_hash(_password_new)
        cursor.execute('UPDATE users SET uname=%s, email=%s, upassword=%s, phonenum=%s WHERE id=%s',
                       (_name, _email, _hashed_password_new, _phonenum, _id))
        conn.commit()
        msg['info'] = 'Success!!'
    else:
        # wrong password
        msg['info'] = 'WRONGPWD'

    cursor.close()
    conn.close()
    return json.dumps(msg)
