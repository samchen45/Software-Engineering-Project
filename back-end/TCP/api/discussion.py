from flask import json, request
import TCP
import TCP.utils as utils
import datetime

# view all posts
@TCP.app.route('/api/viewposts', methods=['POST'])
def viewPosts():
    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    cursor.execute('SELECT id, title, text, owner, time, updated_time FROM dis_posts \
            ORDER BY updated_time DESC')
    data = cursor.fetchall()
    msg = []
    for post in data:
        _id, _title, _text, _owner, _createtime, _updatedtime = post
        # preview content
        if len(_text) > 30:
            _preview = _text[:10] + '...' + _text[-10:]
        else:
            _preview = _text
        # get user name and user type
        cursor.execute('SELECT uname, utype FROM users \
            WHERE id=%s', (_owner,))
        user_data = cursor.fetchone()
        if user_data is None:
            print('_owner <{}> not found in viewPosts()'.format(_owner))
            msg = ['owner id not found, please contact backend crews']
            break  
        _author, _utype = user_data

        d = {}
        d['qid'] = _id
        d['author'] = _author
        d['utype'] = _utype
        d['title'] = _title
        d['preview'] = _preview
        d['createtime'] = _createtime
        d['updatedtime'] = _updatedtime
        d['avatar'] = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'  # TODO
        msg.append(d)

    # return to frontend
    cursor.close()
    conn.close()
    return json.dumps(msg)


# create a post
@TCP.app.route('/api/createpost', methods=['POST'])
def createPost():
    # get parameters from request
    _title = request.form.get('title', type=str)
    _text = request.form.get('text', type=str)
    _owner = request.form.get('uid', type=str)
    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    # TODO: check if user is enrolled in the lab

    # insert into database
    cursor.execute('INSERT INTO dis_posts(title, text, owner) \
            VALUES (%s, %s, %s)', (_title, _text, _owner))
    conn.commit()

    cursor.execute('SELECT id, title, text, owner, time, updated_time FROM dis_posts \
            ORDER BY updated_time DESC')
    data = cursor.fetchall()
    msg = []
    for post in data:
        _id, _title, _text, _owner, _createtime, _updatedtime = post
        # preview content
        if len(_text) > 30:
            _preview = _text[:10] + '...' + _text[-10:]
        else:
            _preview = _text
        # get user name and user type
        cursor.execute('SELECT uname, utype FROM users \
            WHERE id=%s', (_owner,))
        user_data = cursor.fetchone()
        if user_data is None:
            print('_owner <{}> not found in viewPosts()'.format(_owner))
            msg = ['owner id not found, please contact backend crews']
            break  
        _author, _utype = user_data

        d = {}
        d['qid'] = _id
        d['author'] = _author
        d['utype'] = _utype
        d['title'] = _title
        d['preview'] = _preview
        d['createtime'] = _createtime
        d['updatedtime'] = _updatedtime
        d['avatar'] = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'  # TODO
        msg.append(d)

    # return to frontend
    cursor.close()
    conn.close()
    return json.dumps(msg)


# delete a post
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
        # judge if the user is an admin or teacher
        cursor.execute('SELECT utype FROM users \
            WHERE id=%s', (_uid,))
        user_type = cursor.fetchone()
        if user_type[0] == 'S':
            print('uid <{}> does not own postid <{}> in deletePost(), owner is {}'.format(
                _uid, _postid, _owner))
            cursor.close()
            conn.close()
            return json.dumps(['uid error'])

    # delete course from TCPDB.courses
    cursor.execute('DELETE FROM dis_posts WHERE id=%s', (_postid,))
    conn.commit()

    # return to frontend
    msg = ['delte success']
    cursor.close()
    conn.close()
    return json.dumps(msg)


# reply a post
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
    print(_postid)
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

    # TODO: update the updated_time of post
    _updatedtime = datetime.datetime.now()
    cursor.execute('UPDATE dis_posts SET updated_time=CURRENT_TIMESTAMP WHERE id=%s', \
            (_postid, ))
    conn.commit()

    cursor.execute('SELECT id, owner, time, text, quote FROM dis_replies \
            WHERE postid=%s ORDER BY id DESC', (_postid,))
    data = cursor.fetchall()
    msg = []
    for reply in data:
        _id, _owner, _datetime, _content, _quote = reply
        
        # get user name and user type
        cursor.execute('SELECT uname, utype FROM users \
            WHERE id=%s', (_owner,))
        use_data = cursor.fetchone()
        if use_data is None:
            print('_owner <{}> not found in postReply()'.format(_owner))
            msg = ['owner id not found, please contact backend crews']
            break
        d = {}
        _author, _utype = use_data
        
        d['author'] = _author
        d['utype'] = _utype
        d['content'] = _content
        d['datetime'] = _datetime
        d['quote'] = _quote
        d['avatar'] = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'  # TODO
        msg.append(d)

    # return to frontend
    # msg = ['success']
    cursor.close()
    conn.close()
    return json.dumps(msg)


# TODO: view all replies
@TCP.app.route('/api/viewreplies', methods=['POST'])
def viewReplies():
    # get parameters from request
    _postid = request.form.get('postid', type=int)

    msg = {}
    d_post = {}
    d_reply = {}
    replylist = []

    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    print(_postid)
    # TODO: post_title, post_content, post_owner, post_createtime
    cursor.execute('SELECT title, text, owner, time FROM dis_posts \
            WHERE id=%s', (_postid,))
    data = cursor.fetchone()
    _title, _pcontent, _pownerid, _createtime = data

    cursor.execute('SELECT uname FROM users \
            WHERE id=%s', (_pownerid,))
    _pownername = cursor.fetchone()

    d_post['ptitle'] = _title
    d_post['pcontent'] = _pcontent
    d_post['powner'] = _pownername
    d_post['pcreatetime'] = _createtime
    
    msg['post'] = d_post

    cursor.execute('SELECT id, owner, time, text, quote FROM dis_replies \
            WHERE postid=%s ORDER BY id DESC', (_postid,))
    data = cursor.fetchall()
    for reply in data:
        _id, _owner, _datetime, _content, _quote = reply
        # get user name and user type
        cursor.execute('SELECT uname, utype FROM users \
            WHERE id=%s', (_owner,))
        user_data = cursor.fetchone()
        if user_data is None:
            print('_owner <{}> not found in viewReplies()'.format(_owner))
            msg = ['owner id not found, please contact backend crews']
            break
        _author, _utype = user_data

        d_reply = {}
        d_reply['author'] = _author
        d_reply['utype'] = _utype
        d_reply['content'] = _content
        d_reply['datetime'] = _datetime
        d_reply['quote'] = _quote
        d_reply['avatar'] = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'  # TODO
        
        replylist.append(d_reply)
    # print(replylist)
    msg['reply'] = replylist

    # return to frontend
    cursor.close()
    conn.close()
    return json.dumps(msg)


# view all posts of certain lab
# @TCP.app.route('/api/viewlabpost', methods=['POST'])
# def viewLabPosts():
#     # get parameters from request
#     _labid = request.form.get('labid', type=int)    
#     # connect to mysql
#     conn = TCP.mysql.connect()
#     cursor = conn.cursor()

#     msg = []
#     # get lab name
#     cursor.execute('SELECT name FROM labs \
#         WHERE id=%s', (_labid,))
#     lab_data = cursor.fetchone()
#     if lab_data is None:
#         print('_labid <{}> not found in viewLabPosts()'.format(_labid))
#         msg = ['lab id not found, please contact backend crews']
#         # return to frontend
#         cursor.close()
#         conn.close()
#         return json.dumps(msg)

#     _labname = lab_data[0]

#     cursor.execute('SELECT id, labid, title, text, owner, time, updated_time FROM dis_posts \
#             WHERE labid=%s ORDER BY updated_time DESC', (_labid,))
#     data = cursor.fetchall()
#     for post in data:
#         _id, _labid, _title, _text, _owner, _createtime, _updatedtime = post
#         # preview content
#         _preview = _text[:20] + '...' + _text[-20:]

#         # get user name and user type
#         cursor.execute('SELECT uname, utype FROM users \
#             WHERE id=%s', (_owner,))
#         user_data = cursor.fetchone()
#         if user_data is None:
#             print('_owner <{}> not found in viewPosts()'.format(_owner))
#             msg = ['owner id not found, please contact backend crews']
#             break  
#         _author, _utype = data

#         d = {}
#         d['author'] = _author
#         d['utype'] = _utype
#         d['lab'] = _labname
#         d['title'] = _title
#         d['preview'] = _preview
#         d['createtime'] = _createtime
#         d['updatedtime'] = _updatedtime
#         d['avatar'] = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'  # TODO
#         msg.append(d)

#     # return to frontend
#     cursor.close()
#     conn.close()
#     return json.dumps(msg)



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
# @TCP.app.route('/api/getpostlist', methods=['POST'])
# def getPostList():
#     # get parameters from request
#     _postid = request.form.get('labid', type=int)
#     # connect to mysql
#     conn = TCP.mysql.connect()
#     cursor = conn.cursor()

#     cursor.execute('SELECT id, owner, time, text, quote FROM dis_replies \
#             WHERE postid=%s ORDER BY id DESC', (_postid,))
#     data = cursor.fetchall()
#     msg = []
#     for reply in data:
#         _id, _owner, _datetime, _content, _quote = reply
#         #TODO: return to frontend
#         # get user name and user type
#         cursor.execute('SELECT uname, utype FROM users \
#             WHERE id=%s', (_owner,))
#         data = cursor.fetchone()
#         if data is None:
#             print('_owner <{}> not found in viewPosts()'.format(_owner))
#             msg = ['owner id not found, please contact backend crews']
#             break
#         d = {}
#         _author, _utype = data
#         d['author'] = _author
#         d['utype'] = _utype
#         d['content'] = _content
#         d['datetime'] = _datetime
#         d['avatar'] = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'  # TODO
#         msg.append(d)

#     # return to frontend
#     cursor.close()
#     conn.close()
#     return json.dumps(msg)


# @TCP.app.route('/api/getlablist', methods=['POST'])
# def getLabList():
#     # get parameters from request
#     _uid = request.form.get('uid', type=str)
#     print(_uid)
#     # connect to mysql
#     conn = TCP.mysql.connect()
#     cursor = conn.cursor()

#     cursor.execute('SELECT * FROM labs')
#     all_labs = cursor.fetchall()
#     msg = utils.labs2list(all_labs)
#     # return to frontend
#     cursor.close()
#     conn.close()
#     print(msg)
#     return json.dumps(msg)


# @TCP.app.route('/api/getalllist', methods=['POST'])
# def getAllList():
#     # get parameters from request
#     # _uid = request.form.get('uid', type=str)
#     # print(_uid)
#     # connect to mysql
#     conn = TCP.mysql.connect()
#     cursor = conn.cursor()
#     msg = []
#     cursor.execute('SELECT * FROM labs')
#     all_labs = cursor.fetchall()
#     msg.append(utils.labs2list(all_labs))

#     # students
#     cursor.execute('SELECT id, uname FROM users')
#     all_students = cursor.fetchall()
#     s = []
#     for stu in all_students:
#         _id, _name = stu
#         s.append({'id': _id, 'name': _name})
#     msg.append(s)
#     # return to frontend
#     cursor.close()
#     conn.close()
#     print(msg)
#     return json.dumps(msg)
