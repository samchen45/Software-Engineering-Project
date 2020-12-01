from flask import json, request
import TCP
import TCP.utils as utils


@TCP.app.route('/api/createcourse', methods=['POST'])
def createCourse():
    _cname = request.form.get('cname', type=str)
    _id = request.form.get('id', type=str)
    _cdes = request.form.get('cdes', type=str)
    _ctid = _id
    _ctextbook = request.form.get('ctextbook', type=str)
    # connect to mysql
    conn = TCP.mysql.connect()
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


@TCP.app.route('/api/editcourse', methods=['POST'])
def editCourse():
    # get parameters from request
    _cid = request.form.get('cid', type=str)
    _cname = request.form.get('cname', type=str)
    _id = request.form.get('id', type=str)
    _cdes = request.form.get('cdes', type=str)
    _ctextbook = request.form.get('ctextbook', type=str)
    _ctid = _id
    # connect to mysql
    conn = TCP.mysql.connect()
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


@TCP.app.route('/api/deletecourse', methods=['POST'])
def deleteCourse():
    # get parameters from request
    _cid = request.form.get('cid', type=str)
    _id = request.form.get('id', type=str)
    _ctid = _id
    # connect to mysql
    conn = TCP.mysql.connect()
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


@TCP.app.route('/api/viewcourses', methods=['POST'])
def viewCourses():
    # get parameters from request
    _id = request.form.get('userid', type=str)
    # connect to mysql
    conn = TCP.mysql.connect()
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


@TCP.app.route('/api/viewstudents', methods=['POST'])
def viewStudents():
    # get parameters from request
    _uid = request.form.get('uid', type=str)
    _cid = request.form.get('cid', type=str)
    # connect to mysql
    conn = TCP.mysql.connect()
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
