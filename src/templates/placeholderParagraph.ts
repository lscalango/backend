import {
    Paragraph,
    TextRun,
    AlignmentType,
} from 'docx';

// Função auxiliar para criar o parágrafo placeholder da imagem (para reutilização)
export function createPlaceholderImageParagraph(): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text: "Insira aqui a imagem principal", // Texto atualizado conforme solicitado
                italics: true,
                color: "7F7F7F", // Cinza
                size: 20, // 10pt
            }),
        ],
        alignment: AlignmentType.CENTER, // Centraliza o texto da instrução
        spacing: { after: 400, before: 200 },
        // A propriedade 'border' foi removida para não exibir a delimitação.
        // Removido o 'frame' para que o espaço não seja limitado em altura pela definição do frame.
        // Removido 'indent' pois a borda e o alinhamento central já destacam o parágrafo.
    });
}

// Função auxiliar para criar o parágrafo placeholder da imagem da CAMADA
export function createLayerImagePlaceholderParagraph(): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text: "Insira aqui a imagem da camada", // Texto específico para a imagem da camada
                italics: true,
                color: "7F7F7F", // Cinza
                size: 20, // 10pt
            }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200, before: 100 }, // Espaçamento ajustado para imagens de camada
        // A propriedade 'border' foi removida para não exibir a delimitação.
    });
}