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
