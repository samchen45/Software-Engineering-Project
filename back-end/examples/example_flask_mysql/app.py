from flask import Flask, render_template, json, request
from flaskext.mysql import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
from nameko.standalone.rpc import ClusterRpcProxy

mysql = MySQL()
app = Flask(__name__)
RPC_CONFIG = {'AMQP_URI': "amqp://guest:guest@localhost"}

# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'TCPAdmin'
app.config['MYSQL_DATABASE_PASSWORD'] = 'password'
app.config['MYSQL_DATABASE_DB'] = 'TCPDB'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)


@app.route('/')
def main():
    return render_template('index.html')

@app.route('/showSignUp')
def showSignUp():
    return render_template('signup.html')


@app.route('/signUp',methods=['POST','GET'])
def signUp():
    _name = request.form['inputName']
    _email = request.form['inputEmail']
    _password = request.form['inputPassword']

    conn = mysql.connect()
    cursor = conn.cursor()

    with ClusterRpcProxy(RPC_CONFIG) as rpc:
        rpc.signup_mysql.signup.call_async(_name, _email, _password)
    return json.dumps({'html':'<span>Enter the required fields</span>'})

if __name__ == "__main__":
    app.run(port=5002)