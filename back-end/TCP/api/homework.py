from flask import json, request
import os
import datetime
import TCP
import TCP.utils as utils


@TCP.app.route('/api/tea_posthomework', methods=['POST'], strict_slashes=False)
def tea_post_homework():
    """
    Post homework (for teacher).
    """
    _id = request.form.get('id', type=str)

    # connect to mysql
    conn = TCP.mysql.connect()
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

    # _cid = "1"
    # _hdate = "2020-10-01"
    # _hanswer = "ANSWER"

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


# @TCP.app.route('/api/tea_viewbrief_homework', methods=['POST'], strict_slashes=False)
# def tea_view_brief_homework():
#     """
#     View brief homework (for teacher).
#     """
#     _id = request.form.get('id', type=str)

#     # connect to mysql
#     conn = TCP.mysql.connect()
#     cursor = conn.cursor()
#     cursor.execute('SELECT utype FROM users WHERE id=%s', (_id,))
#     data = cursor.fetchall()

#     # judge if it's teacher
#     if data[0][0] != 'T':
#         return None

#     cursor.execute('SELECT * FROM courses WHERE ctid=%s', (_id,))
#     data = cursor.fetchall()

#     # return to frontend
#     msg = {}
#     if len(data) > 0:
#         msg['cid'] = data[0][0]
#         msg['cname'] = data[0][1]
#     else:
#         msg['info'] = 'NULL'

#     cursor.execute('SELECT hname FROM homeworks WHERE cid=%s', (_id,))
#     data = cursor.fetchall()

#     if len(data) > 0:
#         msg['hname'] = data[0][0]
#     else:
#         msg['info'] = 'NULL'

#     cursor.close()
#     conn.close()
#     return json.dumps(msg)


@TCP.app.route('/api/tea_viewdetailed_homework', methods=['POST'], strict_slashes=False)
def tea_view_detailed_homework():
    """
    View detailed homework (for teacher).
    """
    _id = request.form.get('id', type=str)

    # connect to mysql
    conn = TCP.mysql.connect()
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
        'SELECT * FROM submit WHERE cid=%s and hname=%s', (_cid, _hname,))
    data = cursor.fetchone()

    msg = {}
    if len(data) == 0:
        msg['info'] = 'NULL'
    else:
        msg['uid'] = data[1]
        msg['hurl'] = data[2]
        msg['hstatus'] = data[3]
        msg['score'] = data[4]

    cursor.execute('SELECT uname FROM users WHERE uid=%s', (msg['_id'],))
    data = cursor.fetchall()
    msg['uname'] = data[0][0]

    cursor.close()
    conn.close()
    return json.dumps(msg)


@TCP.app.route('/api/scorehomework', methods=['POST'], strict_slashes=False)
def score_homework():
    """
    Score homework.
    """
    # get parameters from request
    _hname = request.form.get('hname', type=str)
    _uid = request.form.get('uid', type=str)
    _score = request.form.get('score', type=str)
    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    cursor.execute('UPDATE homeworks SET score=%s WHERE hname=%s AND uid=%s',
                   (_score, _hname, _uid))
    conn.commit()

    msg = {'SUCCEED'}
    cursor.close()
    conn.close()
    return json.dumps(msg)


@TCP.app.route('/api/stu_viewcourse', methods=['POST'], strict_slashes=False)
def stu_view_course():
    """
    View course (for student).
    """
    _id = request.form.get('id', type=str)

    # connect to mysql
    conn = TCP.mysql.connect()
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


@TCP.app.route('/api/stu_viewhomework', methods=['POST'], strict_slashes=False)
def stu_view_homework():
    """
    View homework (for student).
    """
    _id = request.form.get('id', type=str)

    # connect to mysql
    conn = TCP.mysql.connect()
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


@TCP.app.route('/api/submithomework', methods=['POST'], strict_slashes=False)
def submit_homework():
    """
    Submit homework (for student).
    """
    # get parameters from request
    _hid = request.form.get('hid', type=str)
    _uid = request.form.get('uid', type=str)
    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    cursor.execute('SELECT cid,hdate FROM homeworks WHERE hid=%s', (_hid,))
    data = cursor.fetchall()
    _cid = data[0][0]
    _date = data[0][1]
    cursor.close()
    conn.close()

    file_dir = os.path.join(
        TCP.app.config['BASEDIR'], TCP.app.config['UPLOAD_FOLDER'], _cid, _hid, _uid)  # 拼接成合法文件夹地址
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
