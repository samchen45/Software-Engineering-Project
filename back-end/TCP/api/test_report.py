from pylatex import Document, LongTabu, HFill, Package, LongTable, MultiColumn
from pylatex.utils import bold


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

    # Generate data table
    with doc.create(LongTabu("| X[l] | X[l] | X[l] | X[l] |")) as data_table:
        data_table.add_hline()
        data_table.add_row(['实验名称', "", "", ""])
        data_table.add_row(['姓名', "name", '学号', '111'])
        data_table.add_hline()





        header_row1 = ["Prov是啥呢", "Num", "CurBal", "IntPay"]
        # data_table.add_row(header_row1, mapper=[bold])
        data_table.add_hline()
        data_table.add_empty_row()
        data_table.end_table_header()
        data_table.add_row(["Prov", "Num", "CurBal", "IntPay"])
        row = ["PA", "9", "$100", "Test"]
        for i in range(50):
            data_table.add_row(row)

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