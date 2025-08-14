import {
    Paragraph,
    TextRun,
    AlignmentType,
    BorderStyle,
    Footer, // Adicionado para o rodapé da página
} from 'docx';

export function createReportFooter(analysisDateTime: string | undefined): Footer {
    return new Footer({
        children: [
            // Adiciona uma linha horizontal simples acima do texto do rodapé
            new Paragraph({
                border: { top: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                spacing: { before: 50 } // Espaço antes da linha
            }),
            new Paragraph({
                children: [new TextRun({ text: "Fontes Consultadas:", bold: true, size: 10 })], // 5pt = 10 half-points
                spacing: { after: 50, before: 50 } // Pequeno espaço após o título
            }),
            new Paragraph({
                children: [new TextRun({ text: "Urbanístico - Geoportal DF: Infraestrutura de Dados Espaciais do Distrito Federal (IDE/DF), https://www.ide.df.gov.br/geoportal", size: 10 })],
                indent: { left: 200 }, // Pequena indentação para os itens da lista
            }),
            new Paragraph({
                children: [new TextRun({ text: "Ambiental - Sisdia: Sistema Distrital de Informações Ambientais do Distrito Federal, https://www.sisdia.df.gov.br", size: 10 })],
                indent: { left: 200 },
            }),
            new Paragraph({
                children: [new TextRun({ text: "Fundiário - Terrageo: Portal de informações e mapas da Terracap, https://terrageo2.terracap.df.gov.br/", size: 10 })],
                indent: { left: 200 },
            }),
            // Adiciona o parágrafo "Relatório de Consulta" com data/hora ao rodapé, alinhado à direita
            new Paragraph({
                children: [
                    new TextRun({
                        text: `Relatório de Consulta${analysisDateTime ? ` - ${analysisDateTime}` : ''}`,
                        italics: true,
                        color: "7F7F7F",
                        size: 12,
                    }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 200 }
            }),
        ],
    });
}