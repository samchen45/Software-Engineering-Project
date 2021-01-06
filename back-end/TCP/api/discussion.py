from flask import json, request
import TCP
import TCP.utils as utils


@TCP.app.route('/api/createpost', methods=['POST'])
def createPost():
    # get parameters from request
    _labid = request.form.get('labid', type=int)
    _title = request.form.get('title', type=str)
    _text = request.form.get('text', type=str)
    _owner = request.form.get('uid', type=str)
    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    # TODO: check if user is enrolled in the lab

    # insert into database
    cursor.execute('INSERT INTO dis_posts(labid, title, text, owner) \
            VALUES (%s, %s, %s, %s)', (_labid, _title, _text, _owner))
    conn.commit()

    # return to frontend
    msg = ['success']
    cursor.close()
    conn.close()
    return json.dumps(msg)


@TCP.app.route('/api/deletepost', methods=['POST'])
def deletePost():
    # get parameters from request
    _postid = request.form.get('postid', type=int)
    _uid = request.form.get('uid', type=str)
    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    # check if user can delete the post
    cursor.execute('SELECT owner FROM dis_posts where id=%s', (_postid,))
    data = cursor.fetchone()
    if not data:
        print('postid <{}> not found in deletePost()'.format(_postid))
        cursor.close()
        conn.close()
        return json.dumps(['postid not found'])
    _owner = data[0]
    if _owner != _uid:
        # TODO: teacher/admin

        print('uid <{}> does not own postid <{}> in deletePost(), owner is {}'.format(
            _uid, _postid, _owner))
        cursor.close()
        conn.close()
        return json.dumps(['uid error'])

    # delete course from TCPDB.courses
    cursor.execute('DELETE FROM dis_posts WHERE id=%s', (_postid,))
    conn.commit()

    # return to frontend
    msg = ['success']
    cursor.close()
    conn.close()
    return json.dumps(msg)


@TCP.app.route('/api/postreply', methods=['POST'])
def postReply():
    # get parameters from request
    _postid = request.form.get('postid', type=int)
    _text = request.form.get('content', type=str)
    _owner = request.form.get('uid', type=str)
    _quote = request.form.get('quote', type=int)
    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    # TODO: check if user is enrolled in the lab (omitted)

    # validate postid
    cursor.execute('SELECT * FROM dis_posts where id=%s', (_postid,))
    data = cursor.fetchone()
    if data is None:
        msg = 'postid <{}> does not exist in postReply()'.format(_postid)
        print(msg)
        cursor.close()
        conn.close()
        return json.dumps([msg])

    # TODO: quote

    # insert into database
    cursor.execute('INSERT INTO dis_replies(postid, owner, text, quote) \
            VALUES (%s, %s, %s, %s)', (_postid, _owner, _text, _quote))
    conn.commit()

    # return to frontend
    msg = ['success']
    cursor.close()
    conn.close()
    return json.dumps(msg)


@TCP.app.route('/api/viewpost', methods=['POST'])
def viewPost():
    # get parameters from request
    _postid = request.form.get('postid', type=int)
    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    cursor.execute('SELECT id, owner, time, text, quote text FROM dis_replies \
            WHERE postid=%s ORDER BY id DESC', (_postid,))
    data = cursor.fetchall()
    msg = []
    for reply in data:
        _id, _owner, _datetime, _content, _quote = reply
        #TODO: return to frontend
        # get user name and user type
        cursor.execute('SELECT uname, utype FROM users \
            WHERE id=%s', (_owner,))
        data = cursor.fetchone()
        if data is None:
            print('_owner not found in viewPost')
            msg = ['owner id not found, contact psy']
            break
        d = {}
        _author, _utype = data
        d['author'] = _author
        d['utype'] = _utype
        d['content'] = _content
        d['datetime'] = _datetime
        d['avatar'] = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'  # TODO
        msg.append(d)

    # return to frontend
    cursor.close()
    conn.close()
    return json.dumps(msg)


# @TCP.app.route('/api/getpostlist', methods=['POST'])
# def getPostList():
#     # get parameters from request
#     _labid = request.form.get('labid', type=int)
#     _owner = request.form.get('uid', type=str)
#     # connect to mysql
#     conn = TCP.mysql.connect()
#     cursor = conn.cursor()

#     # TODO: list posts ordered by last edit
#     cursor.execute('SELECT title FROM dis_posts \
#             WHERE labid=%s ORDER BY updated_time DESC', (_labid,))
#     data = cursor.fetchall()
#     msg = []
#     for post in data:
#         pass

#     # return to frontend
#     msg = ['success']
#     cursor.close()
#     conn.close()
#     return json.dumps(msg)

#TODO: ADD POST LAYER AND REMOVE THIS FUNCTION!!!!!
@TCP.app.route('/api/getpostlist', methods=['POST'])
def getPostList():
    # get parameters from request
    _postid = request.form.get('labid', type=int)
    print(_postid)
    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    cursor.execute('SELECT id, owner, time, text, quote text FROM dis_replies \
            WHERE postid=%s ORDER BY id DESC', (_postid,))
    data = cursor.fetchall()
    msg = []
    for reply in data:
        _id, _owner, _datetime, _content, _quote = reply
        #TODO: return to frontend
        # get user name and user type
        cursor.execute('SELECT uname, utype FROM users \
            WHERE id=%s', (_owner,))
        data = cursor.fetchone()
        if data is None:
            print('_owner not found in viewPost')
            msg = ['owner id not found, contact psy']
            break
        d = {}
        _author, _utype = data
        d['author'] = _author
        d['utype'] = _utype
        d['content'] = _content
        d['datetime'] = _datetime
        d['avatar'] = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'  # TODO
        msg.append(d)

    # return to frontend
    cursor.close()
    conn.close()
    print(msg)
    return json.dumps(msg)


@TCP.app.route('/api/getlablist', methods=['POST'])
def getLabList():
    # get parameters from request
    _uid = request.form.get('uid', type=str)
    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM labs')
    all_labs = cursor.fetchall()
    msg = utils.labs2list(all_labs)
    # return to frontend
    cursor.close()
    conn.close()
    return json.dumps(msg)

