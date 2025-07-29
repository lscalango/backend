import {
    Paragraph,
    TextRun,
    Table,
    HeadingLevel,
    AlignmentType,
} from 'docx';

import { QueryResult } from 'src/models/ResultsData';

// 4. Relatório Descritivo
// Esta seção agora vem após as informações iniciais e o placeholder da imagem principal.
export function createDescriptiveReportSection(queryResults: QueryResult[]): Paragraph[] | Table[] {

    const descriptiveReportSection: (Paragraph | Table)[] = [];

    descriptiveReportSection.push(
        new Paragraph({
            text: "Relatório Descritivo",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200, before: 300 }, // Espaçamento antes e depois do título da seção
        })
    );

    descriptiveReportSection.push(
        new Paragraph({
            children: [
                new TextRun("O presente relatório visa descrever a situação da área consultada em relação aos aspectos fundiários, urbanísticos e ambientais, com base nas informações disponíveis nos sistemas geoespaciais do Governo do Distrito Federal."),
            ],
            spacing: { after: 150 },
        })
    );

    // Subseção: Análise Fundiária
    descriptiveReportSection.push(
        new Paragraph({
            children: [new TextRun({ text: "Análise Fundiária:", bold: true })],
            spacing: { after: 100, before: 150 },
        })
    );

    const fundiarioLayersWithIntersection = queryResults
        .filter(result => result.hasIntersection && result.layerName.startsWith("Fundiário"))
        .map(result => result.layerName);

    if (fundiarioLayersWithIntersection.length > 0) {
        descriptiveReportSection.push(
            new Paragraph({
                children: [
                    new TextRun("A análise das camadas do grupo 'Fundiário' indicou interação com os seguintes temas:"),
                ],
                spacing: { after: 50 },
            })
        );
        fundiarioLayersWithIntersection.forEach(layerName => {
            descriptiveReportSection.push(
                new Paragraph({
                    text: layerName,
                    bullet: { level: 0 },
                    indent: { left: 720, hanging: 360 }, // Indentação padrão para bullet points
                    spacing: { after: 50 },
                })
            );
        });
    } else {
        descriptiveReportSection.push(
            new Paragraph({
                children: [
                    new TextRun("Não foi identificada interação com as camadas do grupo 'Fundiário' consultadas para o ponto informado."),
                ],
                spacing: { after: 100 },
            })
        );
    }

    descriptiveReportSection.push(
        new Paragraph({
            children: [
                new TextRun({ text: "[Inserir aqui análise complementar sobre os aspectos fundiários...]", italics: true, color: "7F7F7F" }),
            ],
            spacing: { after: 150, before: 50 },
        })
    );

    // Placeholders para outras análises (Urbanística, Ambiental) e Conclusão
    // Subseção: Análise Urbanística
    descriptiveReportSection.push(
        new Paragraph({
            children: [new TextRun({ text: "Análise Urbanística:", bold: true })],
            spacing: { after: 100, before: 150 },
        })
    );

    const urbanisticoLayersWithIntersection = queryResults
        .filter(result => result.hasIntersection && result.layerName.startsWith("Urbanístico"))
        .map(result => result.layerName);

    if (urbanisticoLayersWithIntersection.length > 0) {
        descriptiveReportSection.push(
            new Paragraph({
                children: [
                    new TextRun("A análise das camadas do grupo 'Urbanístico' indicou interação com os seguintes temas:"),
                ],
                spacing: { after: 50 },
            })
        );
        urbanisticoLayersWithIntersection.forEach(layerName => {
            descriptiveReportSection.push(
                new Paragraph({
                    text: layerName,
                    bullet: { level: 0 },
                    indent: { left: 720, hanging: 360 },
                    spacing: { after: 50 },
                })
            );
        });
    } else {
        descriptiveReportSection.push(
            new Paragraph({
                children: [
                    new TextRun("Não foi identificada interação com as camadas do grupo 'Urbanístico' consultadas para o ponto informado."),
                ],
                spacing: { after: 100 },
            })
        );
    }
    descriptiveReportSection.push(new Paragraph({ children: [new TextRun({ text: "[Inserir aqui análise complementar sobre os aspectos urbanísticos...]", italics: true, color: "7F7F7F" })], spacing: { after: 150, before: 50 } }));

    // Subseção: Análise Ambiental
    descriptiveReportSection.push(
        new Paragraph({
            children: [new TextRun({ text: "Análise Ambiental:", bold: true })],
            spacing: { after: 100, before: 150 },
        })
    );

    const ambientalLayersWithIntersection = queryResults
        .filter(result => result.hasIntersection && result.layerName.startsWith("Ambiental"))
        .map(result => result.layerName);

    if (ambientalLayersWithIntersection.length > 0) {
        descriptiveReportSection.push(
            new Paragraph({
                children: [
                    new TextRun("A análise das camadas do grupo 'Ambiental' indicou interação com os seguintes temas:"),
                ],
                spacing: { after: 50 },
            })
        );
        ambientalLayersWithIntersection.forEach(layerName => {
            descriptiveReportSection.push(
                new Paragraph({
                    text: layerName,
                    bullet: { level: 0 },
                    indent: { left: 720, hanging: 360 },
                    spacing: { after: 50 },
                })
            );
        });
    } else {
        descriptiveReportSection.push(
            new Paragraph({
                children: [
                    new TextRun("Não foi identificada interação com as camadas do grupo 'Ambiental' consultadas para o ponto informado."),
                ],
                spacing: { after: 100 },
            })
        );
    }
    descriptiveReportSection.push(new Paragraph({ children: [new TextRun({ text: "[Inserir aqui análise complementar sobre os aspectos ambientais...]", italics: true, color: "7F7F7F" })], spacing: { after: 150, before: 50 } }));

    // Subseção: Observações (anteriormente Conclusão e Recomendações)
    descriptiveReportSection.push(new Paragraph({ children: [new TextRun({ text: "Observações:", bold: true })], spacing: { after: 100, before: 150 } }));
    descriptiveReportSection.push(new Paragraph({ children: [new TextRun({ text: "[Inserir aqui as observações...]", italics: true, color: "7F7F7F" })], spacing: { after: 150 } }));

    // Adiciona a nova seção "SÉRIE HISTÓRICA"
    descriptiveReportSection.push(
        new Paragraph({
            children: [new TextRun({ text: "SÉRIE HISTÓRICA – Levantamento com imagens históricas do Google Earth Pro – 2017/2025", bold: true })],
            spacing: { after: 100, before: 150 },
        })
    );

    return descriptiveReportSection;

}