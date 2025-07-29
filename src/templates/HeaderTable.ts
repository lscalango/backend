import * as fs from 'fs';
import * as path from 'path';
import {
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    AlignmentType,
    BorderStyle,
    VerticalAlign,
    HeightRule,
    ImageRun, // Adicionado para imagens
    ShadingType, // Adicionado para sombreamento de células
} from 'docx';

export function createHeaderTable(processoSEI: string | undefined, endereco: string | undefined): Table {
    const LOGO_BUFFER = fs.readFileSync(path.resolve(__dirname, '../../assets', 'logo.png'));

    // Definição do Cabeçalho Padrão
    const headerCellStyle = {
        shading: {
            fill: "052440", // Cor de fundo azul escuro (#052440)
            val: ShadingType.CLEAR,
            color: "auto",
        },
        verticalAlign: VerticalAlign.CENTER,
    };

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE }, // Ocupa a largura total da página
        columnWidths: [1815, 12585], // Proporção ajustada para paisagem (3.2cm para logo, resto para texto)
        borders: { // Sem bordas para a tabela do cabeçalho
            top: { style: BorderStyle.NONE, size: 0, color: "auto" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
            left: { style: BorderStyle.NONE, size: 0, color: "auto" },
            right: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
        },
        rows: [
            new TableRow({
                height: { value: 1500, rule: HeightRule.ATLEAST }, // Altura mínima para acomodar o logo
                children: [
                    new TableCell({
                        ...headerCellStyle,
                        children: [
                            new Paragraph({
                                children: [
                                    new ImageRun({
                                        data: LOGO_BUFFER,
                                        transformation: {
                                            width: 121,  // 3.20cm
                                            height: 56,   // 1.49cm
                                        },
                                        type: 'png', // Adicionado para especificar o tipo da imagem
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                            }),
                        ],
                    }),
                    new TableCell({
                        ...headerCellStyle,
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "SECRETARIA DE ESTADO DA PROTEÇÃO URBANÍSTICA DO DISTRITO FEDERAL - DF LEGAL", bold: true, color: "FFFFFF", size: 20 })
                                ],
                                alignment: AlignmentType.RIGHT,
                                spacing: { after: 15 }
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "UNIDADE DE GEOPROCESSAMENTO E MONITORAMENTO - UGMON", color: "FFFFFF", size: 18 })
                                ],
                                alignment: AlignmentType.RIGHT,
                                spacing: { after: 15 }
                            }),
                            // Adiciona Processo SEI se fornecido
                            ...(processoSEI ? [
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: `Processo SEI: ${processoSEI}`, color: "FFFFFF", size: 18 })
                                    ],
                                    alignment: AlignmentType.RIGHT,
                                    spacing: { after: 10 }
                                })
                            ] : []),
                            // Adiciona Endereço se fornecido
                            ...(endereco ? [
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: `Endereço: ${endereco}`, color: "FFFFFF", size: 18 })
                                    ],
                                    alignment: AlignmentType.RIGHT,
                                    spacing: { after: 10 }
                                })
                            ] : []),
                            // Removido o parágrafo "Relatório de Consulta" do cabeçalho
                        ],
                    }),
                ],
            }),
        ],
    })
}