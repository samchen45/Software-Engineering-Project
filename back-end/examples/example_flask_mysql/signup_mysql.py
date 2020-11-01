"""
signup info to mysql
"""
from flask import Flask, render_template, json, request
from flaskext.mysql import MySQL
from nameko.rpc import rpc, RpcProxy

class Signup(object):
    """
    用户注册
    """
    name = 'signup'

    app = Flask(__name__)
    def connect(self):
        conn = mysql.connect()
        cursor = conn.cursor()
        return cursor   

    @rpc
    def signup(self, _name: str, _email: str, _password: str):
        """
        signup
        """
        connect()

        try:
            # validate the received values
            if _name and _email and _password:
                
                # All Good, let's call MySQL
                
                _hashed_password = generate_password_hash(_password)
                """
                cursor.callproc('sp_createUser',(_name,_email,_hashed_password))
                data = cursor.fetchall()

                if len(data) is 0:
                    conn.commit()
                    return json.dumps({'message':'User created successfully !'})
                else:
                    """
                return json.dumps({'error':str(data[0])})
                
            else:
                return json.dumps({'html':'<span>Enter the required fields</span>'})
        except Exception as e:
            return json.dumps({'error':str(e)})
        #finally:
            #cursor.close() 
            #conn.close()

        
