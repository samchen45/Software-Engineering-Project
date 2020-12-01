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
    
    # get parameters from request
    _cid = request.form.get('cid', type=str)
    _hname = request.form.get('hname', type=str)
    _hdes = request.form.get('hdes', type=str)
    _hdate = request.form.get('hdate', type=str)  # date: YYYY-MM-DD
    _hanswer = request.form.get('hanswer', type=str)


    # _cid = "1"
    # _hdate = "2020-10-01"
    # _hanswer = "ANSWER"

    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    cursor.execute('INSERT INTO homeworks(cid, hname, hdes, hdate, hanswer) \
        VALUES (%s, %s, %s, %s, %s)' , (_cid, _hname, _hdes, _hdate, _hanswer))
        
    conn.commit()

    msg = []
    # if len(data) == 0:
    #     msg['info'] = 'NULL'
    # else:
    #     msg['info'] = 'SUCCEED'

    cursor.close()
    conn.close()
    return json.dumps(msg)


@TCP.app.route('/api/tea_viewall_homework', methods=['POST'], strict_slashes=False)
def tea_view_all_homework():
    """
    View brief homework (for teacher).
    """

    # get parameters from request
    _id = request.form.get('id', type=str)

    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    # get parameters from request
    cursor.execute('SELECT courses.cid, courses.cname FROM courses WHERE ctid=%s', (_id,))
    courseData = cursor.fetchall()

    # return to frontend
    msg = []
    if len(courseData) > 0:
        for record in courseData:
            tempDic = {}
            tempDic['cid'] = record[0]
            tempDic['cname'] = record[1]
            tempDic['homework'] = []

            cursor.execute('SELECT hid, hname, hdes, hdate FROM homeworks WHERE cid = %s', (record[0],))
            homeworkData = cursor.fetchall()
            for homework in homeworkData:
                homeworkDic = {}
                homeworkDic['hid'] = homework[0]
                homeworkDic['hname'] = homework[1]
                homeworkDic['hdes'] = homework[2]
                homeworkDic['hdate'] = homework[3]
                tempDic['homework'].append(homeworkDic)
                
            msg.append(tempDic)

    cursor.close()
    conn.close()
    return json.dumps(msg)


@TCP.app.route('/api/tea_viewdetailed_homework', methods=['POST'], strict_slashes=False)
def tea_view_detailed_homework():
    """
    View detailed homework (for teacher).
    """

    # get parameters from request
    _hid = request.form.get('hid', type=str)

    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor() 

    cursor.execute('SELECT submit.uid, submit.hurl, submit.hstatus, submit.score, users.uname FROM submit, users \
        WHERE submit.hid=%s and submit.uid=users.id', (_hid,))
    data = cursor.fetchall()

    msg = []
    if len(data) > 0:
        for record in data:
            tempDic = {}
            tempDic['uid'] = record[0]
            tempDic['hurl'] = record[1]
            tempDic['hstatus'] = record[2]
            tempDic['score'] = record[3]
            tempDic['uname'] = record[4]
            msg.append(tempDic)

    cursor.close()
    conn.close()
    return json.dumps(msg)


@TCP.app.route('/api/scorehomework', methods=['POST'], strict_slashes=False)
def score_homework():
    """
    Score homework.
    """
    
    # get parameters from request
    _uid = request.form.get('id', type=str)
    _hid = request.form.get('hid', type=str)
    _score = request.form.get('score', type=str)

    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    cursor.execute('UPDATE submit SET score=%s WHERE hid=%s and uid=%s',
                   (_score, _hid, _uid))
    conn.commit()

    msg = []
    msg.append({'info': 'SUCCEED'})
    cursor.close()
    conn.close()
    return json.dumps(msg)


# @TCP.app.route('/api/stu_viewcourse', methods=['POST'], strict_slashes=False)
# def stu_view_course():
#     """
#     View course (for student).
#     """
#     _id = request.form.get('id', type=str)

#     # connect to mysql
#     conn = TCP.mysql.connect()
#     cursor = conn.cursor()
#     cursor.execute('SELECT utype FROM users WHERE id=%s', (_id,))
#     data = cursor.fetchall()

#     # judge if it's student
#     if data[0][0] != 'S':
#         return None

#     cursor.execute('SELECT * FROM courses WHERE ctid=%s', (_id,))
#     data = cursor.fetchall()

#     # return to frontend
#     msg = []
#     if len(data) > 0:
#         msg['cid'] = data[0][0]
#         msg['cname'] = data[0][1]
#     else:
#         msg['info'] = 'NULL'

#     cursor.close()
#     conn.close()
#     return json.dumps(msg)


@TCP.app.route('/api/stu_viewhomework', methods=['POST'], strict_slashes=False)
def stu_view_homework():
    """
    View homework (for student).
    """
    
    # get parameters from request
    _cid = request.form.get('cid', type=str)
    
    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    cursor.execute(
        'SELECT homeworks.hid, homeworks.hname, homeworks.hdes, homeworks.hdate, submit.score FROM homeworks, submit WHERE cid=%s', (_cid,))
    data = cursor.fetchall()

    msg = []
    if len(data) > 0:
        for record in data:
            tempDic = {}
            tempDic['hid'] = record[0]
            tempDic['hname'] = record[1]
            tempDic['hdes'] = record[2]
            tempDic['hdate'] = record[3]
            msg.append(tempDic)

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

    cursor.execute('SELECT cid, hdate FROM homeworks WHERE hid=%s', (_hid,))
    data = cursor.fetchone()
    _cid = data[0]
    _date = data[1]
    

    file_dir = os.path.join(
        TCP.app.config['BASEDIR'], TCP.app.config['UPLOAD_FOLDER'], str(_cid), _hid, _uid)  # 拼接成合法文件夹地址
    if not os.path.exists(file_dir):
        os.makedirs(file_dir)  # 文件夹不存在就创建
    f = request.files['myfile']  # 从表单的file字段获取文件，myfile为该表单的name值
    if f and utils.allowed_file(f.filename):  # 判断是否是允许上传的文件类型
        fname = f.filename

        # 根据系统时间重命名文件
        # unix_time = int(time.time())
        # new_filename = str(unix_time)+'.'+ext  # 修改了上传的文件名

        ext = fname.rsplit('.', 1)[1]  # 获取文件后缀
        new_filename = fname + '.' + ext
        f.save(os.path.join(file_dir, new_filename))  # 保存文件到UPLOAD_FOLDER
        # print(file_dir)
        file_url = "file://" + file_dir + '/' +  new_filename
        # print(file_url)
        # return render_template('upload.html', status='OK')

        now = datetime.datetime.now()
        submit_status = utils.isOvertime(now.year, now.month, now.day, str(_date))
        cursor.execute('REPLACE INTO submit(hid, uid, hurl, hstatus) VALUES(%s, %s, %s, %s)',
                       (_hid, _uid, file_url, submit_status))
        conn.commit()

        cursor.close()
        conn.close()

        return json.dumps('SUCCEED')

    cursor.close()
    conn.close()
    return json.dumps('FAILED')
