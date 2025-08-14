import {
    Paragraph,
    TextRun,
    Table,
    AlignmentType,
} from 'docx';

function createNote(): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text: "Ressaltamos que a análise se baseou nas consultas aos Portais Oficiais do Distrito Federal (Geoportal, ONDA, SISDIA e TERRAGEO) e em imagens de satélite. Estas nem sempre permitem uma interpretação completamente precisa, tampouco em tempo real, portanto faz-se necessário correlacionar a informação com dados levantados em campo, visando a assertividade na continuidade do atendimento à demanda.",
            }),
        ],
        spacing: { before: 400, after: 200 },
    })
}

function createLocality(): Paragraph {
    return new Paragraph({
        children: [new TextRun("Brasília, 02/06/2025")],
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 400 },
    })
}

function createTechnician(): Paragraph {
    return new Paragraph({
        children: [new TextRun("Luciano dos Santos")],
        alignment: AlignmentType.CENTER,
    })
}
function createSecretary(): Paragraph {
    return new Paragraph({
        children: [new TextRun("Analista de Planejamento Urbano e Infraestrutura - Assessor/UGMON - Matrícula 221.540-3")],
        alignment: AlignmentType.CENTER,
    })
}

export function createConclusionReport(): Paragraph[] | Table[] {
    const docConclusion: (Paragraph | Table)[] = [];
    // Adiciona o texto final do relatório
    docConclusion.push(createNote());
    docConclusion.push(createLocality());
    docConclusion.push(createTechnician());
    docConclusion.push(createSecretary());

    return docConclusion;
}