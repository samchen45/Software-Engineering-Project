"""
TCP helper functions.
"""

import TCP
import random
from flask_mail import Mail, Message

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
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


# judge if submitting is overtime
def isOvertime(year, month, day, set_date):
    split_date = set_date.split('-')
    set_year = split[0]
    set_month = split[0]
    set_day = split[0]

    if year > set_year or (month > set_month or day > set_day):
        return 'E'
        
    return 'Y'