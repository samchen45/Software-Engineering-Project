# app.py
 
from flask import Flask, request
from flasgger import Swagger
from nameko.standalone.rpc import ClusterRpcProxy
 
app = Flask(__name__)
 
CONFIG = {'AMQP_URI': "amqp://guest:guest@192.168.1.158"}
 
@app.route('/hello', methods=['GET'])
def hello():
    with ClusterRpcProxy(CONFIG) as rpc:
        result = rpc.greeting_service.hello(name="jerry")
        return result, 200
 
app.run(debug=True)