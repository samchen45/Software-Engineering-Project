from flask import request, json
import TCP
import TCP.utils as utils

from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, TableStyle, Table, Image
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os
import json


def generate_pdf(sid, labname):
    data = {}
    data['sname'] = '输入学生姓名'
    data['sid'] = 'student id here!'
    data['sreport'] = '学生实验报告  ' * 200
    data['tcomment'] = '教师评价正文  ' * 200

    # labname = request.form.get('Title', type=str)
    # labgoal = request.form.get('Purpose', type=str)
    # numPics = request.form.get('PictureNum', type=int)
    # pictureList_json = request.form.get('PictureList', type=str)

    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    cursor.execute(
        'SELECT * FROM reports WHERE sid=%s AND labname=%s', (sid, labname))
    data_report = cursor.fetchone()
    if not data_report:
        print('report not found with sid=<{}> and labname=<{}>'.format(sid, labname))
        cursor.close()
        conn.close()
        return

    sname = utils.getName(cursor, sid)
    labgoal = data_report[1]
    score = data_report[3]
    method = data_report[4]
    review = data_report[5]

    TCP_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    pdfmetrics.registerFont(
        TTFont('ping', os.path.join(TCP_dir, 'api', 'ping.ttf')))

    # get all stored pictures related to this report
    pics = []
    for pic in os.listdir(os.path.join(TCP_dir, 'files', 'pictures')):
        if pic.startswith('{}_{}'.format(sid, labname)):
            pics.append(pic)

    # create reports folder if not exists
    if not os.path.exists(os.path.join(TCP_dir, 'files', 'reports')):
        os.makedirs(os.path.join(TCP_dir, 'files', 'reports'))

    out_report_name = os.path.join(
        TCP_dir, 'files', 'reports', 'sreport_{}.pdf'.format(sid))

    doc = SimpleDocTemplate(out_report_name, showBoundary=1, pagesize=A4,
                            leftMargin=20 * mm, rightMargin=20 * mm, topMargin=20 * mm, bottomMargin=20 * mm)

    table_style = TableStyle([('FONTNAME', (0, 0), (-1, -1), 'ping'),
                              ('FONTSIZE', (0, 0), (-1, -1), 14),
                              ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                              ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                              ('TOPPADDING', (0, 0), (-1, -1), 10),
                              ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
                              ('GRID', (0, 0), (-1, -1), 0.5, colors.black)
                              ])
    paragraph_style = ParagraphStyle('myparagraphstyle',
                                     fontName='ping',
                                     fontSize=14,
                                     leading=14*1.2
                                     )

    Elements = []
    Elements.append(Table([['实验名称', labname]], colWidths=[
                    25*mm, 145*mm], style=table_style))
    Elements.append(Table([['姓名', sname, '学号', sid]], colWidths=[
                    25*mm, 60*mm, 25*mm, 60*mm], style=table_style))
    Elements.append(Table([['一、实验目的']], colWidths=170*mm, style=table_style))
    Elements.append(Paragraph(labgoal, style=paragraph_style))

    Elements.append(Table([['二、学生实验报告']], colWidths=170*mm, style=table_style))
    # Elements.append(Paragraph(data['sreport'], style=paragraph_style))
    for pic in pics:
        cursor.execute('SELECT des FROM pictures WHERE filename=%s', (pic,))
        des = cursor.fetchone()[0]
        Elements.append(Image(os.path.join(TCP_dir, 'files',
                        'pictures', pic), width=140*mm, height=140*mm * 9/16))
        Elements.append(Paragraph(des, style=paragraph_style))

    Elements.append(Table([['三、实验评价报告']], colWidths=170*mm, style=table_style))
    Elements.append(Paragraph('实验分数: {}'.format(score), style=paragraph_style))
    Elements.append(
        Paragraph('评判方法: {}'.format(method), style=paragraph_style))
    Elements.append(
        Paragraph('系统评价: {}'.format(review), style=paragraph_style))
    # Elements.append(Paragraph(data['tcomment'], style=paragraph_style))

    # generate pdf
    doc.build(Elements)

    cursor.close()
    conn.close()

    # msg = ['success']
    # return json.dumps(msg)


@TCP.app.route('/api/save_report_details', methods=['POST'])
def save_report_details():
    sid = request.form.get('sid', type=str)
    labname = request.form.get('Title', type=str)
    labgoal = request.form.get('Purpose', type=str)
    numPics = request.form.get('PictureNum', type=int)
    pictureList_json = request.form.get('PictureList', type=str)
    grade_json = request.form.get('GradeJson', type=str)

    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    # grades
    grades = json.loads(grade_json)
    score = float(grades['score'])
    method = grades['method']
    review = grades['review']

    # save pictures
    TCP_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    # create pictures folder if not exists
    if not os.path.exists(os.path.join(TCP_dir, 'files', 'pictures')):
        os.makedirs(os.path.join(TCP_dir, 'files', 'pictures'))
    pictureList = json.loads(pictureList_json)
    for i, pic in enumerate(pictureList['target']):
        img_base64 = pic['base64']
        des = pic['des']
        out_picname = '{}_{}_{}.png'.format(sid, labname, i)
        out_fullpath = os.path.join(TCP_dir, 'files', 'pictures', out_picname)
        utils.decode_base64_image(img_base64, out_fullpath)
        # delete existing pictures
        cursor.execute(
            'DELETE FROM pictures WHERE filename=%s', (out_picname,))
        conn.commit()
        cursor.execute('INSERT INTO pictures(filename, des) \
            VALUES (%s, %s)', (out_picname, des))
        conn.commit()

    # if report already exists, update current report
    cursor.execute(
        'SELECT * FROM reports WHERE sid=%s AND labname=%s', (sid, labname))
    data = cursor.fetchone()
    if data is not None:
        # update current report
        cursor.execute('UPDATE reports SET score=%s, method=%s, review=%s WHERE sid=%s AND labname=%s',
                       (score, method, review, sid, labname))
        conn.commit()
    else:
        # inser new report into database
        cursor.execute('INSERT INTO reports(labname, labgoal, sid, score, method, review) \
            VALUES (%s, %s, %s, %s, %s, %s)', (labname, labgoal, sid, score, method, review))
        conn.commit()

    cursor.close()
    conn.close()

    generate_pdf(sid, labname)
    msg = ['success']
    return json.dumps(msg)


@TCP.app.route('/api/read_report', methods=["GET", 'POST'])
def read_report():
    # get parameters from request
    _labid = request.form.get('labid', type=str)
    _uid = request.form.get('uid', type=str)
    print(_labid, _uid)

    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    # get parameters from request
    cursor.execute(
        'SELECT * FROM reports WHERE labid=%s AND uid=%s', (_labid, _uid))
    reportData = cursor.fetchall()

    # return to frontend
    msg = []
    if reportData:
        for record in reportData:
            tempDic = {}
            tempDic['labid'] = record[0]
            tempDic['labname'] = record[1]
            tempDic['labaim'] = record[2]
            tempDic['uid'] = record[3]
            tempDic['uname'] = record[4]
            tempDic['stu_comment'] = record[5]
            tempDic['teacher_comment'] = record[6]
            tempDic['attachment'] = record[7]
            tempDic['signature'] = record[8]
            tempDic['score_repo'] = record[9]
            msg.append(tempDic)

    cursor.close()
    conn.close()
    print(msg)
    return json.dumps(msg)


@TCP.app.route('/api/add_comment', methods=['POST'])
def add_comment():
    # get parameters from request
    _stucomment = request.form.get('stucomment', type=str)
    _teacomment = request.form.get('teacomment', type=str)
    _labid = request.form.get('labid', type=str)
    _uid = request.form.get('uid', type=str)
    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    # add comment
    print(_stucomment)
    cursor.execute('UPDATE reports SET stucomment=%s, teacomment=%s WHERE labid=%s AND uid=%s',
                   (_stucomment, _teacomment, _labid, _uid),)
    conn.commit()
    msg = {}
    msg['info'] = 'Success!!'

    cursor.close()
    conn.close()
    return json.dumps(msg)


# @TCP.app.route('/api/add_teachercomment', methods=['POST'])
# def updateInfo():
#     # get parameters from request
#     _teachercomment = request.form.get('teachercomment', type=str)
#     _labid = request.form.get('labid', type=str)
#     _uid = request.form.get('uid', type=str)
#     # connect to mysql
#     conn = TCP.mysql.connect()
#     cursor = conn.cursor()

#     # add comment
#     cursor.execute('UPDATE reports SET teachercomment=%s WHERE labid=%s AND uid=%s',
#                     (_comment, _labid, _uid),
#     conn.commit()
#     msg['info'] = 'Success!!'

#     cursor.close()
#     conn.close()
#     return json.dumps(msg)
