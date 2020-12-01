# -*- coding: utf-8 -*-
"""
Main backend Python codes.
"""

from flask import Flask, render_template, json, request, redirect, session
from flaskext.mysql import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
import json
import TCP
import datetime
import time
import utils
import os

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



# # view course(for teacher)
# @app.route('/api/tea_viewcourse', methods=['POST'], strict_slashes=False)
# def tea_view_course():

#     _id = request.form.get('userid', type=str)

#     # connect to mysql
#     conn = mysql.connect()
#     cursor = conn.cursor()
#     cursor.execute('SELECT utype FROM users WHERE id=%s', (_id,))
#     data = cursor.fetchall()

#     # judge if it's teacher
#     if data[0][0] != 'T':
#         msg['info'] = 'NULL'

#     cursor.execute('SELECT * FROM courses WHERE ctid=%s', (_id,))
#     data = cursor.fetchall()

#     # return to frontend
#     msg = {}
#     if len(data) > 0:
#         arr = []

#         msg['arr'] = [
#             {
#                 'cid': '1',
#                 'cname': 'math'
#             }
#         ]
#         msg['info'] = 'SUCCEED'
#     else:
#         msg['info'] = 'NULL'

#     cursor.close()
#     conn.close()
#     return json.dumps(msg)


# post homework(for teacher)
@app.route('/api/tea_posthomework', methods=['POST'], strict_slashes=False)
def tea_post_homework():

    _id = request.form.get('id', type=str)

    # connect to mysql
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute('SELECT utype FROM users WHERE id=%s', (_id,))
    data = cursor.fetchall()

    # judge if it's teacher
    if data[0][0] != 'T':
        return None

    # get parameters from request
    _cid = request.form.get('cid', type=str)
    _hname = request.form.get('hname', type=str)
    _hdes = request.form.get('hdes', type=str)
    _hdate = request.form.get('hdate', type=str)  # date: YYYY-MM-DD
    _hanswer = request.form.get('hanswer', type=str)

    _cid = "1"
    _hdate = "2020-10-01"
    _hanswer = "ANSWER"

    cursor.execute('INSERT INTO homeworks(cid, hname, hdes, hdate, hanswer) \
        VALUES (%s, %s, %s, %s, %s)', (_cid, _hname, _hdes, _hdate, _hanswer))
    conn.commit()

    msg = {}
    if len(data) == 0:
        msg['info'] = 'NULL'
    else:
        msg['info'] = 'SUCCEED'

    cursor.close()
    conn.close()
    return json.dumps(msg)


# view brief homework(for teacher)
@app.route('/api/tea_viewbrief_homework', methods=['POST'], strict_slashes=False)
def tea_view_brief_homework():

    _id = request.form.get('id', type=str)

    # connect to mysql
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute('SELECT utype FROM users WHERE id=%s', (_id,))
    data = cursor.fetchall()

    # judge if it's teacher
    if data[0][0] != 'T':
        return None

    cursor.execute('SELECT * FROM courses WHERE ctid=%s', (_id,))
    data = cursor.fetchall()

    # return to frontend
    msg = {}
    if len(data) > 0:
        msg['cid'] = data[0][0]
        msg['cname'] = data[0][1]
    else:
        msg['info'] = 'NULL'

    cursor.execute('SELECT hname FROM homeworks WHERE cid=%s', (_id,))
    data = cursor.fetchall()

    if len(data) > 0:
        msg['hname'] = data[0][0]
    else:
        msg['info'] = 'NULL'

    cursor.close()
    conn.close()
    return json.dumps(msg)


# view detailed homework(for teacher)
@app.route('/api/tea_viewdetailed_homework', methods=['POST'], strict_slashes=False)
def tea_view_detailed_homework():

    _id = request.form.get('id', type=str)

    # connect to mysql
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute('SELECT utype FROM users WHERE id=%s', (_id,))
    data = cursor.fetchall()

    # judge if it's teacher
    if data[0][0] != 'T':
        return None

    # get parameters from request
    _cid = request.form.get('cid', type=str)
    _hname = request.form.get('hname', type=str)

    cursor.execute(
        'SELECT * FROM submit WHERE cid=%s nad hname=%s', (_cid, _hnamel,))
    data = cursor.fetchall()

    msg = {}
    if len(data) == 0:
        msg['info'] = 'NULL'
    else:
        msg['uid'] = data[0][1]
        msg['hurl'] = data[0][2]
        msg['hstatus'] = data[0][3]
        msg['score'] = data[0][4]

    cursor.execute('SELECT uname FROM users WHERE uid=%s', (msg['_id'],))
    data = cursor.fetchall()
    msg['uname'] = data[0][0]

    cursor.close()
    conn.close()
    return json.dumps(msg)


# score homework
@app.route('/api/scorehomework', methods=['POST'], strict_slashes=False)
def score_homework():
    # get parameters from request
    _hname = request.form.get('hname', type=str)
    _uid = request.form.get('uid', type=str)
    _score = request.form.get('score', type=str)
    # connect to mysql
    conn = mysql.connect()
    cursor = conn.cursor()

    cursor.execute('UPDATE homeworks SET score=%s WHERE hname=%s AND uid=%s',
                   (_score, _hname, _uid))
    conn.commit()

    msg = {'SUCCEED'}
    cursor.close()
    conn.close()
    return json.dumps(msg)


# view course(for student)
@app.route('/api/stu_viewcourse', methods=['POST'], strict_slashes=False)
def stu_view_course():

    _id = request.form.get('id', type=str)

    # connect to mysql
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute('SELECT utype FROM users WHERE id=%s', (_id,))
    data = cursor.fetchall()

    # judge if it's student
    if data[0][0] != 'S':
        return None

    cursor.execute('SELECT * FROM courses WHERE ctid=%s', (_id,))
    data = cursor.fetchall()

    # return to frontend
    msg = {}
    if len(data) > 0:
        msg['cid'] = data[0][0]
        msg['cname'] = data[0][1]
    else:
        msg['info'] = 'NULL'

    cursor.close()
    conn.close()
    return json.dumps(msg)


# view homework(for student)
@app.route('/api/stu_viewhomework', methods=['POST'], strict_slashes=False)
def stu_view_homework():

    _id = request.form.get('id', type=str)

    # connect to mysql
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute('SELECT utype FROM users WHERE id=%s', (_id,))
    data = cursor.fetchall()

    # judge if it's student
    if data[0][0] != 'S':
        return None

    # get parameters from request
    _cid = request.form.get('cid', type=str)

    cursor.execute('SELECT * FROM homeworks WHERE cid=%s', (_cid, _hnamel,))
    data = cursor.fetchall()

    msg = {}
    if len(data) == 0:
        msg['info'] = 'NULL'
    else:
        msg['hid'] = data[0][1]
        msg['hname'] = data[0][2]
        msg['hdes'] = data[0][3]
        msg['hdate'] = data[0][4]

    cursor.close()
    conn.close()
    return json.dumps(msg)


# submit homework(for student)
@app.route('/api/submithomework', methods=['POST'], strict_slashes=False)
def submit_homework():
    # get parameters from request
    _hid = request.form.get('hid', type=str)
    _uid = request.form.get('uid', type=str)
    # connect to mysql
    conn = mysql.connect()
    cursor = conn.cursor()

    cursor.execute('SELECT cid,hdate FROM homeworks WHERE hid=%s', (_hid,))
    data = cursor.fetchall()
    _cid = data[0][0]
    _date = data[0][1]
    cursor.close()
    conn.close()

    file_dir = os.path.join(
        app.config['BASEDIR'], app.config['UPLOAD_FOLDER'], _cid, _hid, _uid)  # 拼接成合法文件夹地址
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

        now = datetime.datetime.now()
        submit_status = isOvertime(now_time.year, now.month, now.day, _date)
        cursor.execute('REPLACE INTO submit(hid, uid, url, status) VALUES(%s, %s, %s, submit_status)',
                       (_hid, _uid, file_dir, submit_status))
        conn.commit()

        return json.dumps('SUCCEED')

    return json.dumps('FAILED')


# # download file
# @app.route('/api/download/<filename>', methods=['GET'], strict_slashes=False)
# def download(filename):
#     # get parameters from request
#     _cid = request.form.get('cid', type=str)
#     _hid = request.form.get('hid', type=str)
#     _uid = request.form.get('uid', type=str)

#     file_dir = os.path.join(basedir, app.config['UPLOAD_FOLDER'], _cid, _hid, _uid)  # 拼接成合法文件夹地址

#     if request.method == "GET":
#         if os.path.isfile(os.path.join(file_dir, filename)):
#             return send_from_directory(file_dir, filename, as_attachment=True)
#         abort(404)


## course stuff
@app.route('/api/createcourse', methods=['POST'])
def createCourse():
    _cname = request.form.get('cname', type=str)
    _id = request.form.get('id', type=str)
    _cdes = request.form.get('cdes', type=str)
    _ctid = _id
    _ctextbook = request.form.get('ctextbook', type=str)
    # connect to mysql
    conn = mysql.connect()
    cursor = conn.cursor()
    # check if course already exists (omitted)

    # create new course and store in TCPDB.courses
    cursor.execute('INSERT INTO courses(cname, ctid, cdes, ctextbook) \
        VALUES (%s, %s, %s, %s)', (_cname, _ctid, _cdes, _ctextbook))
    conn.commit()

    # return to frontend
    cursor.execute('SELECT * FROM courses WHERE ctid=%s', (_ctid,))
    all_courses = cursor.fetchall()
    msg = utils.courses2dict(all_courses)

    cursor.close()
    conn.close()
    return json.dumps(msg)


@app.route('/api/editcourse', methods=['POST'])
def editCourse():
    # get parameters from request
    _cid = request.form.get('cid', type=str)
    _cname = request.form.get('cname', type=str)
    _id = request.form.get('id', type=str)
    _cdes = request.form.get('cdes', type=str)
    _ctextbook = request.form.get('ctextbook', type=str)
    _ctid = _id
    # connect to mysql
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM courses WHERE cid=%s', (_cid,))
    data = cursor.fetchone()

    ## if course not found (omitted)
    # msg = {}
    # if len(data) == 0:
    #     msg['info'] = 'NULL'
    #     cursor.close()
    #     conn.close()
    #     return json.dumps(msg)

    # update info
    cursor.execute('UPDATE courses SET cname=%s, ctid=%s, cdes=%s, ctextbook=%s WHERE cid=%s',
                   (_cname, _ctid, _cdes, _ctextbook, _cid))
    conn.commit()

    # return to frontend
    cursor.execute('SELECT * FROM courses WHERE ctid=%s', (_ctid,))
    all_courses = cursor.fetchall()
    msg = utils.courses2dict(all_courses)

    cursor.close()
    conn.close()
    return json.dumps(msg)


@app.route('/api/deletecourse', methods=['POST'])
def deleteCourse():
    # get parameters from request
    _cid = request.form.get('cid', type=str)
    _id = request.form.get('id', type=str)
    _ctid = _id
    # connect to mysql
    conn = mysql.connect()
    cursor = conn.cursor()

    # validate identity (omitted)

    # delete course from TCPDB.courses
    cursor.execute('DELETE FROM courses WHERE cid=%s', (_cid,))
    conn.commit()
    # TCPDB.rosters will be deleted via FOREIGN KEY

    # return to frontend
    cursor.execute('SELECT * FROM courses WHERE ctid=%s', (_ctid,))
    all_courses = cursor.fetchall()
    msg = utils.courses2dict(all_courses)

    cursor.close()
    conn.close()
    return json.dumps(msg)


@app.route('/api/viewcourses', methods=['POST'])
def viewCourses():
    # get parameters from request
    _id = request.form.get('id', type=str)
    # connect to mysql
    conn = mysql.connect()
    cursor = conn.cursor()

    # validate user id and get user type
    cursor.execute('SELECT utype FROM users WHERE id=%s', (_id,))
    data = cursor.fetchone()
    if len(data) == 0:
        cursor.close()
        conn.close()
        print('viewCourses <id> not found!!')
        return json.dumps({})
    user_type = data[0]

    if user_type == 'T':
        cursor.execute('SELECT * FROM courses WHERE ctid=%s', (_id,))
        all_courses = cursor.fetchall()
        msg = utils.courses2dict(all_courses)
    elif user_type == 'S':
        # all courses
        cursor.execute('SELECT * FROM courses')
        all_courses = cursor.fetchall()
        msg = utils.courses2dict(all_courses)
        for cid in msg:
            msg[cid]['status'] = 'NULL'
            msg[cid]['cteacher'] = utils.getName(cursor, msg[cid]['ctid'])
        # active courses
        cursor.execute('SELECT cid FROM rosters WHERE sid=%s', (_id,))
        all_active_courses = cursor.fetchall()
        for active_course in all_active_courses:
            msg[active_course[0]]['status'] = 'active'
        # completed courses
        cursor.execute('SELECT cid FROM pastrosters WHERE sid=%s', (_id,))
        all_completed_courses = cursor.fetchall()
        for completed_course in all_completed_courses:
            msg[completed_course[0]]['status'] = 'completed'

    cursor.close()
    conn.close()
    return json.dumps(msg)


@app.route('/api/viewstudents', methods=['POST'])
def viewStudents():
    # get parameters from request
    _uid = request.form.get('uid', type=str)
    _cid = request.form.get('cid', type=str)
    # connect to mysql
    conn = mysql.connect()
    cursor = conn.cursor()

    # validate course id
    cursor.execute('SELECT ctid FROM courses WHERE cid=%s', (_cid,))
    data = cursor.fetchone()
    if len(data) == 0:
        cursor.close()
        conn.close()
        print('viewStudents <cid> not found!!')
        return json.dumps({})
    # check if teacher id and course id match
    if _uid != data[0]:
        cursor.close()
        conn.close()
        print('viewStudents <cid> and <uid> not match!!')
        return json.dumps({})

    # return student list
    cursor.execute('SELECT sid FROM rosters WHERE cid=%s', (_cid,))
    data = cursor.fetchall()
    msg = []
    for student in data:
        sid = student[0]
        sname = utils.getName(cursor, sid)
        msg.append([sid, sname])

    cursor.close()
    conn.close()
    return json.dumps(msg)


if __name__ == "__main__":
    app.run(port=5002)
