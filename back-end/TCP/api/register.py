### IGNORE THIS FILE FOR NOW.    --PSY


from flask import Flask, render_template, json, request, redirect, session
import TCP

app = TCP.app
mysql = TCP.mysql


@app.route('/api/register', methods=['POST'])
def register():
    try:
        _id = request.form.get('id', type=str)
        _name = request.form.get('name', type=str)
        _email = request.form.get('email', type=str)
        _password = request.form.get('password', type=str)
        _phonenum = request.form.get('phonenum', type=str)

        # call MySQL
        conn = mysql.connect()
        cursor = conn.cursor()

        msg = {}

        # validate the received values
        if _name and _email and _password and _email and _password and _phonenum:
            # check if user already exists
            cursor.execute('SELECT * FROM users WHERE id=%s', (_id,))
            if len(cursor.fetchall()) != 0:
                msg['info'] = 'error: user already exists!'
                return json.dumps(msg)
            # check if id and name match in the database, get user type
            cursor.execute('SELECT * FROM people WHERE id=%s', (_id,))
            data = cursor.fetchone()
            if len(data) == 0:
                msg['info'] = 'error: id does not exist in school database!!'
                return json.dumps(msg)
            if _name != str(data[1]):
                msg['info'] = 'error: id and name do not match in school database!!'
                return json.dumps(msg)
            _type = str(data[2])
            # create new user and store in TCPDB
            _hashed_password = generate_password_hash(_password)
            # cursor.callproc('sp_createUser', (_name, _email, _hashed_password))
            cursor.execute('INSERT INTO users(id, name, email, password, phonenum, type) \
                VALUES (%s, %s, %s, %s, %s, %s)', (_id, _name, _email, _hashed_password, _phonenum, _type))
            conn.commit()
            msg['info'] = _type
            msg['name'] = _name
            # msg['type'] = _type
            return json.dumps(msg)

            # data = cursor.fetchall()
            # if len(data) == 0:
            #     conn.commit()
            #     return json.dumps({'message': 'User created successfully !'})
            # else:
            #     return json.dumps({'error': str(data[0])})
        # else:
        #     return json.dumps({'html': '<span>Enter the required fields</span>'})

    except Exception as e:
        print(e)
        return json.dumps({'error': str(e)})
    finally:
        cursor.close()
        conn.close()
