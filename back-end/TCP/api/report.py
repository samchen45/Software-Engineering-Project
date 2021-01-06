from flask import request, json
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, Image, PageBreak, Paragraph
from reportlab.lib.units import inch, mm
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import TCP
import TCP.utils as utils

# # 增加的字体，支持中文显示,需要自行下载支持中文的字体
# pdfmetrics.registerFont(TTFont('SimSun', 'SimSun.ttf'))
# pdfmetrics.registerFont(TTFont('pingbold', 'PingBold.ttf'))
# pdfmetrics.registerFont(TTFont('ping', 'ping.ttf'))
# pdfmetrics.registerFont(TTFont('hv', 'Helvetica.ttf'))
# styles = getSampleStyleSheet()
# styles.add(ParagraphStyle(fontName='SimSun', name='SimSun', leading=20, fontSize=12))


# def table_model():
#     """
#     添加表格
#     :return:
#     """
#     base = [
#         ["实验名称", "小类"],
#         ["WebFramework", "django"],
#         ["", "flask"],
#         ["", "web.py"],
#         ["", "tornado"],
#         ["Office", "xlsxwriter"],
#         ["", "openpyxl"],
#         ["", "xlrd"],
#         ["", "xlwt"],
#         ["", "python-docx"],
#         ["", "docxtpl"],
#     ]

#     style = [
#         # 设置字体
#         ('FONTNAME', (0, 0), (-1, -1), 'SimSun'),

#         # 合并单元格 (列,行)
#         ('SPAN', (0, 0), (1, 0)),
#         ('SPAN', (0, 2), (0, 5)),
#         ('SPAN', (0, 6), (0, 11)),

#         # 单元格背景
#         ('BACKGROUND', (0, 1), (1, 1), HexColor('#548DD4')),

#         # 字体颜色
#         ('TEXTCOLOR', (0, 1), (1, 1), colors.white),
#         # 对齐设置
#         ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
#         ('ALIGN', (0, 0), (-1, -1), 'CENTER'),

#         # 单元格框线
#         ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
#         ('BOX', (0, 0), (-1, -1), 0.5, colors.black),
#     ]

#     component_table = Table(base, style=style)
#     return component_table


# def generate_pdf():
#     """
#     生成pdf
#     :return:
#     """

#     # style
#     title_style = ParagraphStyle(name="TitleStyle", fontName="pingbold", fontSize=48, alignment=TA_LEFT, leftMargin=50)
    
#     sub_title_style = ParagraphStyle(name="SubTitleStyle", fontName="hv", fontSize=32,
#                                             textColor=colors.HexColor(0x666666), alignment=TA_LEFT, )

#     content_style = ParagraphStyle(name="ContentStyle", fontName="ping", fontSize=18, leading=25, spaceAfter=20,
#                                         underlineWidth=1, alignment=TA_LEFT, )

#     foot_style = ParagraphStyle(name="FootStyle", fontName="ping", fontSize=14, textColor=colors.HexColor(0xB4B4B4),
#                                         leading=25, spaceAfter=20, alignment=TA_CENTER, )

#     table_title_style = ParagraphStyle(name="TableTitleStyle", fontName="pingbold", fontSize=20, leading=25,
#                                             spaceAfter=10, alignment=TA_LEFT, )

#     sub_table_style = ParagraphStyle(name="SubTableTitleStyle", fontName="ping", fontSize=16, leading=25,
#                                             spaceAfter=10, alignment=TA_LEFT, )

#     basic_style = TableStyle([('FONTNAME', (0, 0), (-1, -1), 'ping'),
#                                     ('FONTSIZE', (0, 0), (-1, -1), 12),
#                                     ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
#                                     ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
#                                     ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
#                                     # 'SPAN' (列,行)坐标
#                                     ('SPAN', (1, 0), (3, 0)),
#                                     ('SPAN', (1, 1), (3, 1)),
#                                     ('SPAN', (1, 2), (3, 2)),
#                                     ('SPAN', (1, 5), (3, 5)),
#                                     ('SPAN', (1, 6), (3, 6)),
#                                     ('SPAN', (1, 7), (3, 7)),
#                                     ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
#                                     ])

#     common_style = TableStyle([('FONTNAME', (0, 0), (-1, -1), 'ping'),
#                                     ('FONTSIZE', (0, 0), (-1, -1), 12),
#                                     ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
#                                     ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
#                                     ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
#                                     # ('SPAN', (0, 1), (0, 1)),
#                                     # ('SPAN', (2, 1), (0, 1)),
#                                     ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
#                                     ])

#     base = [
#         ["实验名称", "实验一"],
#         ["姓名", "张三","学号", "001"],
#         ["学号", "001"],
#         ["WebFramework", "django"],
#         ["WebFramework", "django"],

#         # ["", "flask"],
#     ]

#     path = "test.pdf"
#     data = list()

#     data.append(Spacer(1, 20 * mm))
    
#     # add image
#     # img = Image('test.jpg')
#     # img.drawHeight = 40 * mm
#     # img.drawWidth = 40 * mm
#     # img.hAlign = TA_CENTER
#     # data.append(img)
#     # data.append(Spacer(1, 10 * mm))
    
#     # add title
#     # data.append(Paragraph("实验报告", title_style))
#     # data.append(Spacer(1, 45 * mm))
    
#     # add sub title
#     # data.append(Paragraph("实验一", sub_title_style))
#     # data.append(Spacer(1, 10 * mm))

#     # data.append(Paragraph("实验名称：" + home_data['task_name'], content_style))
#     # data.append(Paragraph("姓名：" + home_data['report_creator'], content_style))
#     # data.append(Paragraph("报告日期：" + home_data['report_date'], content_style))
#     # data.append(Paragraph("实验名称：实验一", content_style))
#     # data.append(Paragraph("姓名：student1", content_style))
#     # data.append(Paragraph("报告日期：2021-01-01", content_style))
#     # data.append(Spacer(1, 55 * mm))
#     # data.append(Paragraph("内部文档，请勿外传", foot_style))
#     # data.append(PageBreak())

#     # 实验目的
#     data.append(Paragraph("一、实验目的", table_title_style))
#     data.append(Spacer(1, 3 * mm))
#     task_table = Table(base, colWidths=[25 * mm, 141 * mm], rowHeights=12 * mm, style=common_style)
#     data.append(task_table)

#     data.append(Spacer(1, 10 * mm))

#     # 学生实验报告
#     # data.append(Paragraph("二、学生实验报告", sub_table_style))
#     # basic_table = Table(base, colWidths=[25*mm, 61*mm, 25*mm, 55*mm], rowHeights=12 * mm, style=basic_style)
#     # data.append(basic_table)

#     # data.append(Spacer(1, 10 * mm))

#     # # 评价报告
#     # data.append(Paragraph("三、实验评价报告", sub_table_style))
#     # case_set_table = Table(base, colWidths=[25 * mm, 141 * mm], rowHeights=12 * mm, style=common_style)
#     # data.append(case_set_table)

#     # data.append(PageBreak())
#     data.append(Spacer(1, 15 * mm))

#     # 添加一段文字
#     # data.append(paragraph)
#     # data.append(PageBreak())  # 分页标识
#     # 添加table和图片
#     table = table_model()
#     # data.append(table)
#     data.append(PageBreak())  # 分页标识
#     # img = image_model()
#     # data.append(img)

#     # 设置生成pdf的名字和边距
#     pdf = SimpleDocTemplate(path, rightMargin=0, leftMargin=0, topMargin=40, bottomMargin=0, )
#     # 设置pdf每页的大小
#     pdf.pagesize = (9 * inch, 10 * inch)

#     pdf.multiBuild(data)
#     return "SUCCEED"



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


# @TCP.app.route('/api/generate_report', methods=["GET", 'POST'])
# def test_pdf():

#     path = generate_pdf()

#     return path

# if __name__ == '__main__':
#     app.run(debug=True)
