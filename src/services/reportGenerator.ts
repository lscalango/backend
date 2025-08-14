import * as fs from 'fs';
import * as path from 'path';
import {
  Packer,
  Paragraph,
  TextRun,
  Table,
} from 'docx';
import { PageOrientation } from 'docx';
import { ReportData } from 'src/models/ResultsData';
import { createPlaceholderImageParagraph } from '../templates/placeholderParagraph';
import { createReportName } from '../templates/ReportName';
import { createLocationTable } from '../templates/LocationTable';
import { createDescriptiveReportSection } from '../templates/DescriptiveReportSection';
import { createDetailsLayer } from '../templates/DetailsLayer';
import { createConclusionReport } from '../templates/ConclusionReport';
import { createReportHeader } from '../templates/Header';
import { createReportFooter } from '../templates/Footer';
import { createReportDocument } from '../templates/ReportDocument';

const footnoteIdCoordinates = 1; // ID único para nossa nota de rodapé de exemplo

export async function generateDocxReport(data: ReportData): Promise<Buffer> {
  const {
    coordinates,
    administrativeRegionName,
    queryResults,
    docxInterferenceTableRows,
    analysisDateTime, // Usaremos para o cabeçalho
    numeroUGM,
    processoSEI,
    endereco,
  } = data;
  const docChildren: (Paragraph | Table)[] = [];

  // 1. Nome do Relatório
  docChildren.push(createReportName(numeroUGM));

  // Removido o parágrafo Região Administrativa
  // Removido o parágrafo Coordenadas Consultadas

  // Tabela 2 colunas x 4 linhas após coordenadas
  docChildren.push(createLocationTable(administrativeRegionName, coordinates));

  // Imagem Principal (placeholder) - MOVIMENTADO PARA ANTES DO RESUMO DE INTERFERÊNCIAS
  // E DEPOIS DAS COORDENADAS
  // Sempre adiciona o placeholder para inserção manual da imagem.
  docChildren.push(createPlaceholderImageParagraph());

  // 4. Relatório Descritivo
  // Esta seção agora vem após as informações iniciais e o placeholder da imagem principal.
  const descriptiveReportSection = createDescriptiveReportSection(queryResults);

  // Adicionamos a seção descritiva:
  docChildren.push(...descriptiveReportSection);

  // 5. Detalhes por Camada Consultada (agora adicionado após o Relatório Descritivo)
  const detailsLayer = createDetailsLayer(queryResults);
  docChildren.push(...detailsLayer);

  // Adiciona o texto final do relatório
  docChildren.push(...createConclusionReport());

  // A nota de rodapé das fontes foi movida para o rodapé da página (Footer)
  // Definição do Cabeçalho Padrão

  const reportHeader = createReportHeader(processoSEI, endereco);

  // Definição do Rodapé Padrão (com as Fontes Consultadas)
  const reportFooter = createReportFooter(analysisDateTime);

  // Definição das Notas de Rodapé
  const reportFootnotes = {
    [footnoteIdCoordinates]: { // Usar o mesmo ID definido anteriormente
      children: [
        new Paragraph({
          children: [new TextRun({ text: "As coordenadas são apresentadas no datum WGS84.", size: 16, italics: true })],
        }),
      ],
    },
    // A nota de rodapé footnoteIdSources foi removida daqui pois agora está no Footer
  };

  // Cria o documento DEPOIS que todos os children foram adicionados ao array docChildren
  const doc = createReportDocument(reportHeader, reportFooter, docChildren, reportFootnotes);
  return Packer.toBuffer(doc);
}
