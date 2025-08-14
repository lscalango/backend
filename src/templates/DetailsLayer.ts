import {
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    HeadingLevel,
    AlignmentType,
    BorderStyle,
    VerticalAlign,
    HeightRule,
} from 'docx';
import { QueryResult } from 'src/models/ResultsData';
import { createLayerImagePlaceholderParagraph } from './placeholderParagraph';

function createDetailsTitle(): Paragraph {
    return new Paragraph({
        text: "Detalhes por Camada Consultada",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        pageBreakBefore: true,
        spacing: { before: 400, after: 200 },
    })
}

// 5. Detalhes por Camada Consultada (agora adicionado após o Relatório Descritivo)
export function createDetailsLayer(queryResults: QueryResult[]): Paragraph[] | Table[] {
    const docDetailsLayers: (Paragraph | Table)[] = [];

    docDetailsLayers.push(createDetailsTitle());

    let processedIntersectionCount = 0; // Contador para camadas com interseção que serão exibidas
    queryResults.forEach((result) => {
        if (result.hasIntersection) { // Mostrar detalhes apenas se houver interseção
            const layerNameParagraphOptions: ConstructorParameters<typeof Paragraph>[0] = {
                text: `Camada: ${result.layerName}`,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 150 }, // Espaçamento antes do nome da camada
                pageBreakBefore: processedIntersectionCount > 0 ? true : undefined,
            };

            docDetailsLayers.push(
                new Paragraph(layerNameParagraphOptions)
            );

            // Adiciona placeholder para imagem da camada
            docDetailsLayers.push(createLayerImagePlaceholderParagraph());
            if (result.features && result.features.length > 0) {
                result.features.forEach((feature) => {
                    // Se a feição contiver uma propriedade 'error', exibir como status
                    if (feature.error) {
                        docDetailsLayers.push(
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "Status: ", bold: true }),
                                    new TextRun(String(feature.error)),
                                ],
                                spacing: { after: 100 }, // Espaçamento após a mensagem de status
                            })
                        );
                    } else {
                        // Caso contrário, é uma feição com dados para a tabela de atributos
                        // Não adicionar mais o parágrafo "Detalhes da Feição X:"

                        const attributeRows: TableRow[] = [];
                        let hasActualAttributes = false;

                        for (const key in feature) {
                            if (Object.prototype.hasOwnProperty.call(feature, key)) {
                                // Não incluir a chave 'error' na tabela de atributos, caso exista e não tenha sido tratada acima
                                if (key.toLowerCase() === 'error') continue;

                                if (!hasActualAttributes) {
                                    // Adicionar cabeçalho da tabela somente se houver atributos
                                    attributeRows.push(
                                        new TableRow({
                                            children: [
                                                new TableCell({
                                                    children: [new Paragraph({ children: [new TextRun({ text: "Atributo", bold: true })] })],
                                                    width: { size: 30, type: WidthType.PERCENTAGE },
                                                    verticalAlign: VerticalAlign.CENTER,
                                                }),
                                                new TableCell({
                                                    children: [new Paragraph({ children: [new TextRun({ text: "Valor", bold: true })] })],
                                                    width: { size: 70, type: WidthType.PERCENTAGE },
                                                    verticalAlign: VerticalAlign.CENTER,
                                                }),
                                            ],
                                            tableHeader: true,
                                            height: { value: 400, rule: HeightRule.ATLEAST }
                                        })
                                    );
                                    hasActualAttributes = true;
                                }

                                attributeRows.push(
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph(key)], verticalAlign: VerticalAlign.CENTER }),
                                            new TableCell({ children: [new Paragraph(String(feature[key] ?? ''))], verticalAlign: VerticalAlign.CENTER }),
                                        ],
                                        height: { value: 300, rule: HeightRule.ATLEAST }
                                    })
                                );
                            }
                        }

                        if (hasActualAttributes) { // Adicionar tabela apenas se houver atributos
                            docDetailsLayers.push(
                                new Table({
                                    rows: attributeRows,
                                    width: { size: 100, type: WidthType.PERCENTAGE },
                                    columnWidths: [3000, 7000], // Proporção 30/70
                                    borders: {
                                        top: { style: BorderStyle.SINGLE, size: 1, color: "BFBFBF" },
                                        bottom: { style: BorderStyle.SINGLE, size: 1, color: "BFBFBF" },
                                        left: { style: BorderStyle.SINGLE, size: 1, color: "BFBFBF" },
                                        right: { style: BorderStyle.SINGLE, size: 1, color: "BFBFBF" },
                                        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "BFBFBF" },
                                        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "BFBFBF" },
                                    },
                                })
                            );
                            docDetailsLayers.push(new Paragraph({ spacing: { after: 200 } })); // Espaço após a tabela de atributos
                        }
                    }
                });
            }
            // Se result.hasIntersection for true, mas não houver features, apenas o nome da camada será exibido.
            // A lógica anterior 'else if (result.features && result.features.length > 0 && result.features[0].error)'
            // é agora coberta pelo loop e verificação de 'feature.error' acima.
            processedIntersectionCount++; // Incrementar o contador de camadas com interseção processadas
        }
    });

    return docDetailsLayers;
}