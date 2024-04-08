from flask import Flask, request, send_file
from zebra import Zebra
from fpdf import FPDF
import os

app = Flask(__name__)

@app.route('/convert', methods=['POST'])
def convert_zpl_to_pdf():
    zpl_code = request.data.decode('utf-8')

    # Convert ZPL to PNG using python-zebra
    z = Zebra()
    z.output_device = 'png'
    image_path = 'label.png'
    z.store_graphic('label', zpl_code)
    z.print_graphic('label', output=image_path)

    # Convert PNG to PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.image(image_path, x=10, y=8, w=100)
    pdf_path = 'label.pdf'
    pdf.output(pdf_path)

    # Clean up
    os.remove(image_path)

    # Send the PDF file as a response
    return send_file(pdf_path, as_attachment=True, attachment_filename='label.pdf')

if __name__ == '__main__':
    app.run(debug=True)