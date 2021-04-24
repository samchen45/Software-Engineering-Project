from flask import request, json
import TCP
import TCP.utils as utils

from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, TableStyle, Table
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os


def generate_pdf(data):
    # data = {}
    # data['labname'] = '输入实验名称'
    # data['sname'] = '输入学生姓名'
    # data['sid'] = 'student id here!'
    # data['goal'] = '实验目的正文 ' * 20
    # data['sreport'] = '学生实验报告  ' * 200
    # data['tcomment'] = '教师评价正文  ' * 200

    file_dir = os.path.dirname(os.path.abspath(__file__))
    pdfmetrics.registerFont(TTFont('ping', os.path.join(file_dir, 'ping.ttf')))

    out_file_name = os.path.join(
        file_dir, 'sreport_{}.pdf'.format(data['sid']))

    doc = SimpleDocTemplate(out_file_name, showBoundary=1, pagesize=A4,
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
    Elements.append(Table([['实验名称', data['labname']]], colWidths=[
                    25*mm, 145*mm], style=table_style))
    Elements.append(Table([['姓名', data['sname'], '学号', data['sid']]], colWidths=[
                    25*mm, 60*mm, 25*mm, 60*mm], style=table_style))
    Elements.append(Table([['一、实验目的']], colWidths=170*mm, style=table_style))
    Elements.append(Paragraph(data['goal'], style=paragraph_style))

    Elements.append(Table([['二、学生实验报告']], colWidths=170*mm, style=table_style))
    Elements.append(Paragraph(data['sreport'], style=paragraph_style))

    Elements.append(Table([['三、实验评价报告']], colWidths=170*mm, style=table_style))
    Elements.append(Paragraph(data['tcomment'], style=paragraph_style))

    # generate pdf
    doc.build(Elements)


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
    cursor.execute('SELECT * FROM reports WHERE labid=%s AND uid=%s', (_labid, _uid))
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


# @TCP.app.route('/api/generate_report', methods=["GET", 'POST'])
# def test_pdf():

#     path = generate_pdf()

#     return path

# if __name__ == '__main__':
#     app.run(debug=True)
