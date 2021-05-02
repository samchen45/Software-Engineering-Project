# -*- coding: utf-8 -*-
"""
TCP helper functions.
"""

import TCP
import random
from flask_mail import Mail, Message
import base64

mail = Mail(TCP.app)


def send_email_captcha(recv_addr):
    # generate a 4-digit random code
    code = random.randint(1000, 9999)
    # generate message
    msg = Message(subject='[TCP]您的注册验证码',
                  recipients=[recv_addr]
                  )
    msg.body = '您的注册验证码是{}'.format(code)
    # send email
    mail.send(msg)
    return code


# judge if file is allowed to upload
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in TCP.app.config['ALLOWED_EXTENSIONS']

# convert labs tuple (usually from database) to dictionary
def labs2list(labs: tuple):
    msg = []
    for lab in labs:
        d = {}
        d['labid'] = lab[0]
        d['labname'] = lab[1]
        d['labaim'] = lab[2]
        msg.append(d)
    return msg

# judge if submitting is overtime
def isOvertime(year, month, day, set_date):
    split_date = set_date.split('-')
    set_year = int(split_date[0])
    set_month = int(split_date[1])
    set_day = int(split_date[2])

    if year > set_year or (month > set_month or day > set_day):
        return 'E'
        
    return 'Y'

# get name from id (from database TCPDB.users)
def getName(cursor, id):
    cursor.execute('SELECT uname FROM users WHERE id=%s', (id,))
    data = cursor.fetchone()
    if not data:
        print('ERROR: id <{}> not found in utils.getName()'.format(id))
        return ''
    return data[0]

# decode and save base64 images
def decode_base64_image(base64_img, out_fullpath):
    base64_img_bytes = base64_img.encode('utf-8')
    with open(out_fullpath, 'wb') as out_file:
        decoded_image_data = base64.decodebytes(base64_img_bytes)
        out_file.write(decoded_image_data)
