import {
    Paragraph,
    TextRun,
    AlignmentType,
} from 'docx';

// 1. Nome do Relatório
export function createReportName(numeroUGM: string | undefined): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text: `RELATÓRIO DE CARACTERIZAÇÃO DE ÁREA DE FISCALIZAÇÃO Nº ${numeroUGM || 'XXX/XXXX'
                    }`, // Nome do relatório
                bold: true,
                size: 28, // 14pt (28 half-points)
                font: 'Times New Roman',
            }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
    })
}