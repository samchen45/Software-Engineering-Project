# from reportlab.lib import colors
# from reportlab.platypus import SimpleDocTemplate, Paragraph, TableStyle, Table
# from reportlab.lib.units import mm
# from reportlab.lib.styles import ParagraphStyle
# from reportlab.lib.pagesizes import A4
# from reportlab.pdfbase import pdfmetrics
# from reportlab.pdfbase.ttfonts import TTFont
# import os
# import base64


# def generate_pdf(data):
#     labname = data['Title']
#     labgoal = data['Purpose']
#     numPics = data['PictureNum']


#     file_dir = os.path.dirname(os.path.abspath(__file__))
#     pdfmetrics.registerFont(TTFont('ping', os.path.join(file_dir, 'ping.ttf')))

#     out_file_name = os.path.join(
#         file_dir, 'sreport_{}.pdf'.format(data['sid']))

#     doc = SimpleDocTemplate(out_file_name, showBoundary=1, pagesize=A4,
#                             leftMargin=20 * mm, rightMargin=20 * mm, topMargin=20 * mm, bottomMargin=20 * mm)

#     table_style = TableStyle([('FONTNAME', (0, 0), (-1, -1), 'ping'),
#                               ('FONTSIZE', (0, 0), (-1, -1), 14),
#                               ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
#                               ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
#                               ('TOPPADDING', (0, 0), (-1, -1), 10),
#                               ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
#                               ('GRID', (0, 0), (-1, -1), 0.5, colors.black)
#                               ])
#     paragraph_style = ParagraphStyle('myparagraphstyle',
#                                      fontName='ping',
#                                      fontSize=14,
#                                      leading=14*1.2
#                                      )

#     Elements = []
#     # 实验名称
#     Elements.append(Table([['实验名称', labname]], colWidths=[
#                     25*mm, 145*mm], style=table_style))

#     # 学生姓名与学号
#     Elements.append(Table([['姓名', data['sname'], '学号', data['sid']]], colWidths=[
#                     25*mm, 60*mm, 25*mm, 60*mm], style=table_style))

#     # 实验目的
#     Elements.append(Table([['一、实验目的']], colWidths=170*mm, style=table_style))
#     Elements.append(Paragraph(labgoal, style=paragraph_style))

#     # 学生实验报告
#     Elements.append(Table([['二、学生实验报告']], colWidths=170*mm, style=table_style))
#     Elements.append(Paragraph(data['sreport'], style=paragraph_style))

#     # 实验评价报告
#     Elements.append(Table([['三、实验评价报告']], colWidths=170*mm, style=table_style))
#     Elements.append(Paragraph(data['tcomment'], style=paragraph_style))

#     # generate pdf
#     doc.build(Elements)

# data = {}
# data['Title'] = '输入实验名称'
# data['purpose'] = '实验目的正文 ' * 20

# data['sname'] = '输入学生姓名'
# data['sid'] = 'student id here!'
# data['sreport'] = '学生实验报告  ' * 200
# data['tcomment'] = '教师评价正文  ' * 200

# generate_pdf(data)


import base64
img = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAA' \
    'LEwEAmpwYAAAB1klEQVQ4jY2TTUhUURTHf+fy/HrjhNEX2KRGiyIXg8xgSURuokX' \
    'LxFW0qDTaSQupkHirthK0qF0WQQQR0UCbwCQyw8KCiDbShEYLJQdmpsk3895p4aS' \
    'v92ass7pcfv/zP+fcc4U6kXKe2pTY3tjSUHjtnFgB0VqchC/SY8/293S23f+6VEj' \
    '9KKwCoPDNIJdmr598GOZNJKNWTic7tqb27WwNuuwGvVWrAit84fsmMzE1P1+1TiK' \
    'MVKvYUjdBvzPZXCwXzyhyWNBgVYkgrIow09VJMznpyebWE+Tdn9cEroBSc1JVPS+' \
    '6moh5Xyjj65vEgBxafGzWetTh+rr1eE/c/TMYg8hlAOvI6JP4KmwLgJ4qD0TIbli' \
    'TB+sunjkbeLekKsZ6Zc8V027aBRoBRHVoduDiSypmGFG7CrcBEyDHA0ZNfNphC0D' \
    '6amYa6ANw3YbWD4Pn3oIc+EdL36V3od0A+MaMAXmA8x2Zyn+IQeQeBDfRcUw3B+2' \
    'PxwZ/EdtTDpCPQLMh9TKx0k3pXipEVlknsf5KoNzGyOe1sz8nvYtTQT6yyvTjIax' \
    'smHGB9pFx4n3jIEfDePQvCIrnn0J4B/gA5J4XcRfu4JZuRAw3C51OtOjM3l2bMb8' \
    'Br5eXCsT/w/EAAAAASUVORK5CYII='


def decode_base64_image(base64_img, out_filename):
    base64_img_bytes = base64_img.encode('utf-8')
    with open(out_filename, 'wb') as out_file:
        decoded_image_data = base64.decodebytes(base64_img_bytes)
        out_file.write(decoded_image_data)

decode_base64_image(img, 'lalala.png')