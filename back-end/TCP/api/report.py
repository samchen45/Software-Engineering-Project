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


# @TCP.app.route('/api/generate_pdf', methods=['POST'])
def generate_pdf(report_id):
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
        'SELECT * FROM reports WHERE id=%s', (report_id))
    data_report = cursor.fetchone()
    if not data_report:
        print('report not found with id=<{}>'.format(report_id))
        cursor.close()
        conn.close()
        return

    labname = data_report[1]
    labgoal = data_report[2]
    sid = data_report[3]
    score = data_report[4]
    method = data_report[5]
    review = data_report[6]
    sname = utils.getName(cursor, sid)

    TCP_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    pdfmetrics.registerFont(
        TTFont('ping', os.path.join(TCP_dir, 'api', 'ping.ttf')))

    # get all stored pictures related to this report
    pics = []
    for pic in os.listdir(os.path.join(TCP_dir, 'files', 'pictures')):
        if pic.startswith('{}_'.format(report_id)):
            pics.append(pic)

    # create reports folder if not exists
    if not os.path.exists(os.path.join(TCP_dir, 'files', 'reports')):
        os.makedirs(os.path.join(TCP_dir, 'files', 'reports'))

    out_report_name = os.path.join(
        TCP_dir, 'files', 'reports', '{}_sreport_{}.pdf'.format(report_id, sid))

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

    # if report already exists, update current report
    cursor.execute(
        'SELECT * FROM reports WHERE sid=%s AND labname=%s', (sid, labname))
    data = cursor.fetchone()
    if data is not None:
        report_id = data[0]
        # update current report
        cursor.execute('UPDATE reports SET score=%s, method=%s, review=%s WHERE sid=%s AND labname=%s',
                       (score, method, review, sid, labname))
        conn.commit()
    else:
        # insert new report into database
        cursor.execute('INSERT INTO reports(labname, labgoal, sid, score, method, review) \
            VALUES (%s, %s, %s, %s, %s, %s)', (labname, labgoal, sid, score, method, review))
        cursor.execute('SELECT LAST_INSERT_ID()')
        # get the inserted report id
        report_id = cursor.fetchone()[0]
        conn.commit()

    # PICTURES
    TCP_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    # create pictures folder if not exists
    if not os.path.exists(os.path.join(TCP_dir, 'files', 'pictures')):
        os.makedirs(os.path.join(TCP_dir, 'files', 'pictures'))
    # delete existing pictures from database
    cursor.execute('DELETE FROM pictures WHERE reportid=%s', (report_id,))
    conn.commit()
    # delete existing pictures from file system
    for pic in os.listdir(os.path.join(TCP_dir, 'files', 'pictures')):
        if pic.startswith('{}_'.format(report_id)):
            os.remove(os.path.join(TCP_dir, 'files', 'pictures', pic))
    # save pictures
    pictureList = json.loads(pictureList_json)
    for i, pic in enumerate(pictureList['target']):
        img_base64 = pic['base64']
        des = pic['des']
        out_picname = '{}_{}.png'.format(report_id, i)
        out_fullpath = os.path.join(TCP_dir, 'files', 'pictures', out_picname)
        utils.decode_base64_image(img_base64, out_fullpath)
        # insert into database
        cursor.execute('INSERT INTO pictures(reportid, filename, des) \
            VALUES (%s, %s, %s)', (report_id, out_picname, des))
        conn.commit()

    cursor.close()
    conn.close()

    generate_pdf(report_id)
    msg = ['success']
    return json.dumps(msg)


@TCP.app.route('/api/get_report_list', methods=['POST'])
def get_report_list():
    # get parameters from request
    sid = request.form.get('sid', type=str)

    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM reports WHERE sid=%s', (sid,))
    data_reports = cursor.fetchall()
    report_list = []
    for report in data_reports:
        report_id, labname = report[0], report[1]
        tempDic = {}
        tempDic['id'] = report_id
        tempDic['labname'] = labname
        report_list.append(tempDic)

    cursor.close()
    conn.close()
    msg = {}
    msg['code'] = 0
    msg['report_list'] = report_list
    return json.dumps(msg)


@TCP.app.route('/api/read_report', methods=['POST'])
def read_report():
    # get parameters from request
    reportid = request.form.get('reportid', type=int)

    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    cursor.execute(
        'SELECT * FROM reports WHERE id=%s', (reportid,))
    reportData = cursor.fetchone()

    if reportData is None:
        msg = ['Error: report id not found in read_report']
        cursor.close()
        conn.close()
        return json.dumps(msg)

    # return to frontend
    sid = reportData[3]
    url = '{}_sreport_{}.pdf'.format(reportid, sid)

    msg = {}
    msg['url']= url
    
        

    cursor.close()
    conn.close()
    return json.dumps(msg)


@TCP.app.route('/api/add_comment', methods=['POST'])
def add_comment():
    # get parameters from request
    _stucomment = request.form.get('stucomment', type=str)
    _teacomment = request.form.get('teacomment', type=str)
    _reportid = request.form.get('reportid', type=str)
    # connect to mysql
    conn = TCP.mysql.connect()
    cursor = conn.cursor()

    # add comment
    cursor.execute('UPDATE reports SET review=%s WHERE id=%s',
                   (_teacomment, _reportid),)
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
