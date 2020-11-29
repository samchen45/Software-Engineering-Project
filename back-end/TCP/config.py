"""
TCP configuration.
"""

## debug mode
DEBUG = True

## MySQL configurations
MYSQL_DATABASE_USER = 'TCPAdmin'
MYSQL_DATABASE_PASSWORD = 'password'
MYSQL_DATABASE_DB = 'TCPDB'
MYSQL_DATABASE_HOST = 'localhost'

## flask-mail config
MAIL_DEBUG = False             # 开启debug，便于调试看信息
# MAIL_SUPPRESS_SEND = False    # 发送邮件，为True则不发送
MAIL_SERVER = 'smtp.163.com'  # 邮箱服务器
MAIL_PORT = 465               # 端口
MAIL_USE_SSL = True           # 重要，qq邮箱需要使用SSL
MAIL_USE_TLS = False          # 不需要使用TLS
MAIL_USERNAME = 'tcpadmin@163.com'  # 填邮箱
MAIL_PASSWORD = 'OWMFSYLIPNOBGJDX'      # 密码tcp123456
MAIL_DEFAULT_SENDER = 'tcpadmin@163.com'  # 填邮箱，默认发送者
