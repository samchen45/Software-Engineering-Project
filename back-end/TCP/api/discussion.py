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
    _text = request.form.get('text', type=str)
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
    _owner = request.form.get('uid', type=str)
    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    # TODO

    # return to frontend
    msg = ['success']
    cursor.close()
    conn.close()
    return json.dumps(msg)
