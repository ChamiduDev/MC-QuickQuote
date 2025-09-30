import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, VerticalAlign, BorderStyle, ITableCellMarginOptions, ITableCellOptions, convertInchesToTwip } from 'docx';
import { saveAs } from 'file-saver';
import { QuoteData } from './types';
import { format } from 'date-fns';

export const exportToPdf = async (element: HTMLElement, fileName: string) => {
    // A4 dimensions in mm
    const A4_WIDTH_MM = 210;

    // Clone the element to manipulate styles without affecting the original
    const clone = element.cloneNode(true) as HTMLElement;

    // Style the clone to be a fixed A4 size for canvas rendering
    clone.style.width = `${A4_WIDTH_MM}mm`;
    clone.style.minHeight = `297mm`;
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.margin = '0';
    clone.style.padding = '12mm'; // This should match the original padding if possible
    document.body.appendChild(clone);

    const canvas = await html2canvas(clone, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        width: clone.offsetWidth,
        height: clone.offsetHeight,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight
    });

    // Clean up the cloned element
    document.body.removeChild(clone);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / canvasHeight;

    // Calculate the height of the image in the PDF, maintaining aspect ratio
    const imgHeight = pdfWidth / ratio;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
        position = position - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
    }

    pdf.save(`${fileName}.pdf`);
};

const createBorderlessCell = (children: Paragraph[], options: Omit<ITableCellOptions, 'children' | 'borders'> = {}): TableCell => {
    return new TableCell({
        ...options,
        children,
        borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "auto" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
            left: { style: BorderStyle.NONE, size: 0, color: "auto" },
            right: { style: BorderStyle.NONE, size: 0, color: "auto" },
        },
    });
};

export const exportToWord = async (quote: QuoteData) => {
    const subtotal = quote.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const discountAmount = (subtotal * quote.discount) / 100;
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = (subtotalAfterDiscount * quote.tax) / 100;
    const grandTotal = subtotalAfterDiscount + taxAmount + (quote.hostingCost || 0) + (quote.developmentCost || 0);

    const formatCurrency = (amount: number) => {
        return `${quote.currency}${amount.toFixed(2)}`;
    };

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: { top: convertInchesToTwip(0.5), right: convertInchesToTwip(0.5), bottom: convertInchesToTwip(0.5), left: convertInchesToTwip(0.5) },
                },
            },
            children: [
                new Paragraph({
                    children: [new TextRun({ text: quote.headerText, bold: true, size: 48 })],
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({ text: "" }), // Spacer
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    columnWidths: [3000, 3000, 3000],
                     borders: {
                        top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                        bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                        left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                        right: { style: BorderStyle.NONE, size: 0, color: "auto" },
                        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
                        insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
                    },
                    rows: [
                        new TableRow({
                            children: [
                                createBorderlessCell([
                                    new Paragraph({ text: "From:", bold: true }),
                                    new Paragraph(quote.company.name),
                                    ...quote.company.address.split('\n').map(line => new Paragraph(line)),
                                    new Paragraph(quote.company.contact),
                                ], { verticalAlign: VerticalAlign.TOP }),
                                createBorderlessCell([
                                    new Paragraph({ text: "To:", bold: true }),
                                    new Paragraph(quote.client.name),
                                    new Paragraph(quote.client.company),
                                    ...quote.client.address.split('\n').map(line => new Paragraph(line)),
                                    new Paragraph(quote.client.contact),
                                ], { verticalAlign: VerticalAlign.TOP }),
                                createBorderlessCell([
                                    new Paragraph({ children: [new TextRun({ text: "Quote Number\t", bold: true }), new TextRun(quote.quoteNumber)]}),
                                    new Paragraph({ children: [new TextRun({ text: "Date\t", bold: true }), new TextRun(format(new Date(quote.date), 'MMM dd, yyyy'))]}),
                                ], { verticalAlign: VerticalAlign.TOP, alignment: AlignmentType.RIGHT }),
                            ]
                        })
                    ]
                }),
                new Paragraph({ text: "" }), // Spacer
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    columnWidths: [3000, 3000, 1000, 1000, 1000],
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: "Description", bold: true })]}),
                                new TableCell({ children: [new Paragraph({ text: "Technology", bold: true })]}),
                                new TableCell({ children: [new Paragraph({ text: "Qty", bold: true })], alignment: AlignmentType.RIGHT }),
                                new TableCell({ children: [new Paragraph({ text: "Unit Price", bold: true })], alignment: AlignmentType.RIGHT }),
                                new TableCell({ children: [new Paragraph({ text: "Total", bold: true })], alignment: AlignmentType.RIGHT }),
                            ],
                        }),
                        ...quote.items.map(item => new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph(item.description)] }),
                                new TableCell({ children: [new Paragraph(item.technology)] }),
                                new TableCell({ children: [new Paragraph(String(item.quantity))], alignment: AlignmentType.RIGHT }),
                                new TableCell({ children: [new Paragraph(formatCurrency(item.unitPrice))], alignment: AlignmentType.RIGHT }),
                                new TableCell({ children: [new Paragraph(formatCurrency(item.quantity * item.unitPrice))], alignment: AlignmentType.RIGHT }),
                            ]
                        })),
                    ]
                }),
                new Paragraph({ text: "" }), // Spacer
                new Table({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    columnWidths: [4500, 4500],
                     borders: {
                        top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                        bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                        left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                        right: { style: BorderStyle.NONE, size: 0, color: "auto" },
                        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
                        insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
                    },
                    rows: [
                        new TableRow({
                            children: [
                                createBorderlessCell([new Paragraph("Subtotal")]),
                                createBorderlessCell([new Paragraph(formatCurrency(subtotal))], { alignment: AlignmentType.RIGHT }),
                            ]
                        }),
                         new TableRow({
                            children: [
                                createBorderlessCell([new Paragraph(`Discount (${quote.discount}%)`)]),
                                createBorderlessCell([new Paragraph(formatCurrency(-discountAmount))], { alignment: AlignmentType.RIGHT }),
                            ]
                        }),
                         new TableRow({
                            children: [
                                createBorderlessCell([new Paragraph(`Tax (${quote.tax}%)`)]),
                                createBorderlessCell([new Paragraph(formatCurrency(taxAmount))], { alignment: AlignmentType.RIGHT }),
                            ]
                        }),
                        new TableRow({
                            children: [
                                createBorderlessCell([new Paragraph('Hosting Cost')]),
                                createBorderlessCell([new Paragraph(formatCurrency(quote.hostingCost || 0))], { alignment: AlignmentType.RIGHT }),
                            ]
                        }),
                        new TableRow({
                            children: [
                                createBorderlessCell([new Paragraph('Development Cost')]),
                                createBorderlessCell([new Paragraph(formatCurrency(quote.developmentCost || 0))], { alignment: AlignmentType.RIGHT }),
                            ]
                        }),
                         new TableRow({
                            children: [
                                new TableCell({ 
                                    children: [new Paragraph({ text: "Grand Total", bold: true })],
                                    borders: { top: { style: BorderStyle.SINGLE, size: 2, color: "auto" }, bottom: { style: BorderStyle.NONE, size: 0, color: "auto" }, left: { style: BorderStyle.NONE, size: 0, color: "auto" }, right: { style: BorderStyle.NONE, size: 0, color: "auto" } }
                                }),
                                new TableCell({ 
                                    children: [new Paragraph({ text: formatCurrency(grandTotal), bold: true })],
                                    alignment: AlignmentType.RIGHT,
                                    borders: { top: { style: BorderStyle.SINGLE, size: 2, color: "auto" }, bottom: { style: BorderStyle.NONE, size: 0, color: "auto" }, left: { style: BorderStyle.NONE, size: 0, color: "auto" }, right: { style: BorderStyle.NONE, size: 0, color: "auto" } }
                                }),
                            ]
                        }),
                    ],
                    float: {
                        horizontalAnchor: 'page',
                        verticalAnchor: 'page',
                        relativeHorizontalPosition: 'right',
                        relativeVerticalPosition: 'bottom',
                    },
                    alignment: AlignmentType.RIGHT,
                }),
                new Paragraph({ text: "" }),
                new Paragraph({ text: "Notes", bold: true }),
                ...quote.notes.split('\n').map(line => new Paragraph(line)),
                new Paragraph({ text: "" }),
                new Paragraph({ text: quote.footerText, alignment: AlignmentType.CENTER }),
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${quote.quoteNumber}.docx`);
}