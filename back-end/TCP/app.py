"""
Main backend Python codes.
"""

from flask import Flask, render_template, json, request, redirect, session
from flaskext.mysql import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
import json
import TCP
import utils

# mysql = MySQL()
# app = Flask(__name__)
mysql = TCP.mysql
app = TCP.app
app.secret_key = 'secret'

mysql.init_app(app)


# @app.route('/')
# def showIndex():
#     return render_template('index.html')


# @app.route('/register')
# def showRegister():
#     return render_template('register.html')


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
        if _id and _email and _password and _name and _phonenum:
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
            if _name != str(data[1]):
                msg['info'] = 'error: id and name do not match in school database!!'
                return json.dumps(msg)
            _type = str(data[2])
            # send email captcha
            code = utils.send_email_captcha(_email)
            # verify email captcha
            #TODO
            _code = request.form.get('code', type=int)
            if code != _code:
                msg['info'] = 'ERROR: wrong verification code!! Please check again.'
                return json.dumps(msg)

            # create new user and store in TCPDB
            _hashed_password = generate_password_hash(_password)
            # cursor.callproc('sp_createUser', (_name, _email, _hashed_password))
            cursor.execute('INSERT INTO users(id, name, email, password, phonenum, type) \
                VALUES (%s, %s, %s, %s, %s, %s)', (_id, _name, _email, _hashed_password, _phonenum, _type))
            conn.commit()
            msg['info'] = _type
            msg['name'] = _name
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


# @app.route('/login')
# def showLogin():
#     return render_template('login.html')


@app.route('/api/login', methods=['POST'])
def login():
    _id = request.form.get('id', type=str)
    _password = request.form.get('password', type=str)
    # connect to mysql
    conn = mysql.connect()
    cursor = conn.cursor()
    # cursor.callproc('sp_validateLogin', (_username,))
    cursor.execute('SELECT * FROM users WHERE id=%s', (_id,))
    data = cursor.fetchall()

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


# @app.route('/userhome')
# def showUserHome():
#     if session.get('user'):
#         return render_template('userHome.html')
#     else:
#         return render_template('userhome.html')


# @app.route('/logout')
# def logout():
#     session.pop('user', None)
#     return redirect('/')


@app.route('/api/updateinfo', methods=['POST'])
def updateInfo():
    # get parameters from request
    _id = request.form.get('id', type=str)
    _name = request.form.get('name', type=str)
    _email = request.form.get('email', type=str)
    _password = request.form.get('password', type=str)
    _password_new = request.form.get('password_new', type=str)
    _phonenum = request.form.get('phonenum', type=str)
    # connect to mysql
    conn = mysql.connect()
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
        cursor.execute('UPDATE users SET id=%s, name=%s, email=%s, password=%s, phonenum=%s WHERE id=%s',
                       (_id, _name, _email, _hashed_password_new, _phonenum, _id))
        msg['info'] = 'Success!!'
    else:
        # wrong password
        msg['info'] = 'WRONGPWD'

    cursor.close()
    conn.close()
    return json.dumps(msg)


# @app.route('/')
# def sendemail():
#     utils.send_email_captcha('psypengsiyuan@vip.qq.com')
#     return '<h1>邮件发送成功</h1>'


# post homework
@app.route('/api/posthomework', methods=['POST'], strict_slashes=False)
def api_upload():
    # get parameters from request
    _cid = request.form.get('cid', type=str)
    _hid = request.form.get('hid', type=str)
    _hname = request.form.get('hname', type=str)
    _hdes = request.form.get('hdes', type=str)
    # connect to mysql
    conn = mysql.connect()
    cursor = conn.cursor()

    cursor.execute('REPLACE INTO homeworks(cid, hid, hname, hdes) VALUES(%s, %s, %s, %s)',
                    (_cid, _hid, _hname, _hdes))

    cursor.close()
    conn.close()
    return json.dumps(msg)


# score homework
@app.route('/api/posthomework', methods=['POST'], strict_slashes=False)
def api_upload():
    # get parameters from request
    _hid = request.form.get('hid', type=str)
    _uid = request.form.get('uid', type=str)
    _score = request.form.get('score', type=str)
    # connect to mysql
    conn = mysql.connect()
    cursor = conn.cursor()
    
    cursor.execute('UPDATE homeworks SET score=%s WHERE hid=%s AND uid=%s',
                    (_score, _hid, _uid))

    cursor.close()
    conn.close()
    return json.dumps(msg)


UPLOAD_FOLDER = 'homework'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER  # set upload folder
basedir = os.path.abspath(os.path.dirname(__file__))  # get current absolute dir
ALLOWED_EXTENSIONS = set(['zip', 'pdf', 'txt', 'png', 'jpg', 'xls', 'JPG', 'PNG', 'xlsx', 'gif', 'GIF', 'ppt', 'docx', 'mp4', 'flv'])  # 允许上传的文件后缀


# judge if file is allowed to upload
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


# upload file
@app.route('/api/upload', methods=['POST'], strict_slashes=False)
def api_upload():
    # get parameters from request
    _cid = request.form.get('cid', type=str)
    _hid = request.form.get('hid', type=str)
    _uid = request.form.get('uid', type=str)
    # connect to mysql
    conn = mysql.connect()
    cursor = conn.cursor()

    file_dir = os.path.join(basedir, app.config['UPLOAD_FOLDER'], _cid, _hid, _uid)  # 拼接成合法文件夹地址
    if not os.path.exists(file_dir):
        os.makedirs(file_dir)  # 文件夹不存在就创建
    f = request.files['myfile']  # 从表单的file字段获取文件，myfile为该表单的name值
    if f and allowed_file(f.filename):  # 判断是否是允许上传的文件类型
        fname = f.filename

        # 根据系统时间重命名文件
        # unix_time = int(time.time())
        # new_filename = str(unix_time)+'.'+ext  # 修改了上传的文件名
        
        ext = fname.rsplit('.', 1)[1]  # 获取文件后缀
        new_filename = fname + '.' + ext
        f.save(os.path.join(file_dir, new_filename))  # 保存文件到UPLOAD_FOLDER
        # return render_template('upload.html', status='OK')
        return jsonify({"errno": 0, "errmsg": "上传成功"})
    else:
        # pass
        return jsonify({"errno": 1001, "errmsg": "上传失败"})

    cursor.execute('REPLACE INTO submit(hid, uid, url, status) VALUES(%s, %s, %s, TRUE)',
                    (_hid, _uid, file_dir))

    cursor.close()
    conn.close()
    return json.dumps(msg)


# download file
@app.route('/api/download/<filename>', methods=['GET'], strict_slashes=False)
def download(filename):
    # get parameters from request
    _cid = request.form.get('cid', type=str)
    _hid = request.form.get('hid', type=str)
    _uid = request.form.get('uid', type=str)
    
    file_dir = os.path.join(basedir, app.config['UPLOAD_FOLDER'], _cid, _hid, _uid)  # 拼接成合法文件夹地址
    
    if request.method == "GET":
        if os.path.isfile(os.path.join(file_dir, filename)):
            return send_from_directory(file_dir, filename, as_attachment=True)
        abort(404)


if __name__ == "__main__":
    app.run(port=5002)
