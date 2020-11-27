# coding=utf-8
import os
import time
from flask import Flask, render_template, send_from_directory, request, jsonify


app = Flask(__name__)

UPLOAD_FOLDER = 'upload_file'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER  # 设置文件上传的目标文件夹
basedir = os.path.abspath(os.path.dirname(__file__))  # 获取当前项目的绝对路径
ALLOWED_EXTENSIONS = set(['txt', 'png', 'jpg', 'xls', 'JPG', 'PNG', 'xlsx', 'gif', 'GIF', 'ppt', 'docx', 'mp4', 'flv'])  # 允许上传的文件后缀


# 判断文件是否合法
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


# 具有上传功能的页面
@app.route('/')
def main():
    return render_template('upload.html')


@app.route('/api/upload', methods=['POST'], strict_slashes=False)
def api_upload():
    file_dir = os.path.join(basedir, app.config['UPLOAD_FOLDER'])  # 拼接成合法文件夹地址
    if not os.path.exists(file_dir):
        os.makedirs(file_dir)  # 文件夹不存在就创建
    f = request.files['myfile']  # 从表单的file字段获取文件，myfile为该表单的name值
    if f and allowed_file(f.filename):  # 判断是否是允许上传的文件类型
        fname = f.filename

        # 根据系统时间重命名文件
        ext = fname.rsplit('.', 1)[1]  # 获取文件后缀
        unix_time = int(time.time())
        new_filename = str(unix_time)+'.'+ext  # 修改了上传的文件名
        
        f.save(os.path.join(file_dir, new_filename))  # 保存文件到UPLOAD_FOLDER
        # return render_template('upload.html', status='OK')
        return jsonify({"errno": 0, "errmsg": "上传成功"})
    else:
        # pass
        return jsonify({"errno": 1001, "errmsg": "上传失败"})


@app.route('/api/download/<filename>', methods=['GET'], strict_slashes=False)
def download(filename):
    if request.method == "GET":
        if os.path.isfile(os.path.join(UPLOAD_FOLDER, filename)):
            return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)
        abort(404)

if __name__ == '__main__':
    app.run(port=5001)

