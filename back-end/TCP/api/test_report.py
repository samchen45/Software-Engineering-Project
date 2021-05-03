from pylatex import Document, LongTabu, HFill, Package, LongTable, MultiColumn, StandAloneGraphic, MiniPage, LineBreak, Figure
from pylatex.utils import bold, NoEscape
import os


def genenerate_longtabu():
    geometry_options = {
        # "landscape": True,
        "margin": "0.5in",
        "headheight": "20pt",
        "headsep": "10pt",
        "includeheadfoot": True
    }
    doc = Document(page_numbers=True, geometry_options=geometry_options, document_options=['a4paper'])
    doc.packages.append(Package('xeCJK'))

    TCP_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    # Generate data table
    with doc.create(LongTabu("| X[l] | X[l] | X[l] | X[l] |")) as report:
        report.add_hline()
        report.add_row(['实验名称', MultiColumn(3, align='|l|', data='实验名称是啥呢')])
        report.add_hline()
        report.add_row(['姓名', "name", '学号', '111'])
        report.add_hline()
        report.add_row([MultiColumn(4, align='|l|', data='一、实验目的')])
        report.add_hline()
        report.add_row([MultiColumn(4, align='|l|', data='')])
        report.add_hline()
        report.add_row([MultiColumn(4, align='|l|', data='二、学生实验报告')])
        report.add_hline()
        fig = StandAloneGraphic(os.path.join(TCP_dir, 'api', 'test.jpg'))
        # report.add_row([MultiColumn(4, align='|l|', data=fig)])
        # report.append(StandAloneGraphic(os.path.join(TCP_dir, 'api', 'test.jpg')))
        report.add_hline()
        report.add_row([MultiColumn(4, align='|l|', data='三、实验评价报告')])
        report.add_hline()

        branch_address = MiniPage(
                width=NoEscape(r"0.25\textwidth"),
                pos='t')
        branch_address.append("960 - 22nd street east")
        branch_address.append("\n")
        branch_address.append("Saskatoon, SK")
        report.add_row([MultiColumn(4, align='l', data=branch_address)])


        figure = Figure(position='H')
        figure.add_image(os.path.join(TCP_dir, 'api', 'test.jpg'))
        report.add_row([MultiColumn(4, align='l', data=figure)])



        header_row1 = ["Prov是啥呢", "Num", "CurBal", "IntPay"]
        # data_table.add_row(header_row1, mapper=[bold])
        report.add_hline()
        report.add_empty_row()
        report.end_table_header()
        report.add_row(["Prov", "Num", "CurBal", "IntPay"])
        row = ["PA", "9", "$100", "Test"]
        for i in range(50):
            report.add_row(row)

    doc.append(bold("Grand Total:"))
    doc.append(HFill())
    doc.append(bold("Total"))


    with doc.create(LongTable("l l l")) as data_table:
            data_table.add_hline()
            data_table.add_row(["header 1", "header 2", "header 3"])
            data_table.add_hline()
            data_table.end_table_header()
            data_table.add_hline()
            data_table.add_row((MultiColumn(3, align='r',
                                data='Continued on Next Page'),))
            data_table.add_hline()
            data_table.end_table_footer()
            data_table.add_hline()
            data_table.add_row((MultiColumn(3, align='r',
                                data='Not Continued on Next Page'),))
            data_table.add_hline()
            data_table.end_table_last_footer()
            row = ["Content1", "9", "Longer String"]
            for i in range(150):
                data_table.add_row(row)

    doc.generate_pdf("longtabu", compiler='xelatex', clean=True, clean_tex=True)

genenerate_longtabu()