import {
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    VerticalAlign,
} from 'docx';

// Tabela 2 colunas x 4 linhas após coordenadas
export function createLocationTable(administrativeRegionName: string | null, coordinates: any): Table {
    return new Table({
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph("Linha 1, Coluna 1")],
                        verticalAlign: VerticalAlign.CENTER,
                        rowSpan: 3, // Mescla verticalmente esta célula nas 3 primeiras linhas
                    }),
                    new TableCell({ children: [new Paragraph("Linha 1, Coluna 2")], verticalAlign: VerticalAlign.CENTER }),
                ],
            }),
            new TableRow({
                children: [
                    // Célula mesclada, então só adiciona a coluna 2
                    new TableCell({ children: [new Paragraph("Linha 2, Coluna 2")], verticalAlign: VerticalAlign.CENTER }),
                ],
            }),
            new TableRow({
                children: [
                    // Célula mesclada, então só adiciona a coluna 2
                    new TableCell({ children: [new Paragraph("Linha 3, Coluna 2")], verticalAlign: VerticalAlign.CENTER }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "Região Administrativa: ", bold: true }),
                                    new TextRun(administrativeRegionName || 'Não identificada'),
                                ],
                                spacing: { after: 100 }
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "Coordenadas Consultadas: ", bold: true }),
                                    new TextRun(`${coordinates.lat}, ${coordinates.lon}`),
                                ],
                                spacing: { after: 100 }
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "Fonte da Imagem:", bold: true }),
                                ],
                                spacing: { after: 100 }
                            }),
                        ],
                        verticalAlign: VerticalAlign.CENTER
                    }),
                    new TableCell({ children: [new Paragraph("Linha 4, Coluna 2")], verticalAlign: VerticalAlign.CENTER }),
                ],
            }),
        ],
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [5000, 5000],
        borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "BFBFBF" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "BFBFBF" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "BFBFBF" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "BFBFBF" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "BFBFBF" },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "BFBFBF" },
        },
    })

}