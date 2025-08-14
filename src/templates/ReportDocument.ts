import {
    Document,
    Paragraph,
    Table,
    Header, // Adicionado para o cabeçalho
    Footer, // Adicionado para o rodapé da página
} from 'docx';
import { PageOrientation } from 'docx';

export function createReportDocument(reportHeader: Header, reportFooter: Footer, docChildren: (Paragraph | Table)[], reportFootnotes: any): Document {
    return new Document({
        footnotes: reportFootnotes, // Adiciona as definições de notas de rodapé ao documento
        sections: [{
            headers: { default: reportHeader },
            footers: { default: reportFooter }, // Adiciona o rodapé padrão à seção
            properties: {
                page: {
                    margin: { top: 720, right: 720, bottom: 720, left: 720 }, // Margens de ~0.5 polegada
                    size: {
                        orientation: PageOrientation.LANDSCAPE,
                    },
                },
            },
            children: docChildren, // Agora contém todos os elementos
        }],
    });
}