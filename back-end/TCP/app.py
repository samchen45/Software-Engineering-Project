from flask import Flask, render_template, json, request
from flaskext.mysql import MySQL
from werkzeug.security import generate_password_hash, check_password_hash

mysql = MySQL()
app = Flask(__name__)

# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'TCPAdmin'
app.config['MYSQL_DATABASE_PASSWORD'] = 'password'
app.config['MYSQL_DATABASE_DB'] = 'TCPDB'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)
# conn = mysql.connect()

@app.route('/')
def showIndex():
    return render_template('index.html')

@app.route('/register')
def showRegister():
    return render_template('register.html')


@app.route('/signUp',methods=['POST','GET'])
def signUp():
    try:
        _name = request.form['inputName']
        _email = request.form['inputEmail']
        _password = request.form['inputPassword']


        # call MySQL
        print('111111111')
        conn = mysql.connect()
        print('1.5 1.5 1.5')
        cursor = conn.cursor()
        # validate the received values
        if _name and _email and _password:
            
            print('222222222')
            _hashed_password = generate_password_hash(_password)
            print('2.5 2.52.5')
            print(_hashed_password)
            cursor.callproc('sp_createUser',(_name,_email,_hashed_password))
            print('3333333333')
            data = cursor.fetchall()
            print('HERE!!')


            if len(data) == 0:
                conn.commit()
                return json.dumps({'message':'User created successfully !'})
            else:
                return json.dumps({'error':str(data[0])})
        else:
            return json.dumps({'html':'<span>Enter the required fields</span>'})

    except Exception as e:
        return json.dumps({'error':str(e)})
    finally:
        cursor.close() 
        conn.close()

if __name__ == "__main__":
    app.run(port=5002)