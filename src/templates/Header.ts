import {
    Paragraph,
    BorderStyle,
    Header, // Adicionado para o cabeçalho
} from 'docx';
import { createHeaderTable } from './HeaderTable';

export function createReportHeader(processoSEI: string | undefined, endereco: string | undefined): Header {
    return new Header({
        // Usaremos uma tabela para alinhar o ícone à esquerda e os textos à direita
        children: [
            createHeaderTable(processoSEI, endereco),
            // Adiciona uma linha horizontal simples abaixo do texto do cabeçalho
            new Paragraph({
                border: { bottom: { color: "FFFFFF", space: 1, style: BorderStyle.SINGLE, size: 6 } }, // Linha branca
                spacing: { before: 50 } // Espaço reduzido antes da linha
            }),
        ],
    });
}