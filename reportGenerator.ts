import {
  Document,
  Packer,
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
  ImageRun, // Adicionado para imagens
  Header, // Adicionado para o cabeçalho
  Footer, // Adicionado para o rodapé da página
  FootnoteReferenceRun, // Adicionado para notas de rodapé
  ShadingType, // Adicionado para sombreamento de células
} from 'docx'; 
import { 
  HorizontalPositionAlign, HorizontalPositionRelativeFrom, 
  VerticalPositionAlign, VerticalPositionRelativeFrom 
} from 'docx';

// Interfaces para tipar os dados esperados do frontend
interface QueryResultFeature {
  [key: string]: any;
  error?: string;
}

interface QueryResult {
  layerName: string;
  hasIntersection: boolean;
  features: QueryResultFeature[] | null;
}

export interface ReportData {
  coordinates: { lat: string; lon: string };
  administrativeRegionName: string | null;
  queryResults: QueryResult[];
  mapImageDataUrl?: string | null; // Tornar opcional, pois o frontend não envia mais para inserção automática
  docxInterferenceTableRows?: string[][]; // Dados para a tabela de resumo de interferências
  analysisDateTime?: string; // Data e hora da análise (o frontend envia, e também está em docxInterferenceTableRows)
}

// Função auxiliar para criar o parágrafo placeholder da imagem (para reutilização)
function createPlaceholderImageParagraph(): Paragraph {
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
function createLayerImagePlaceholderParagraph(): Paragraph {
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


export async function generateDocxReport(data: ReportData): Promise<Buffer> {
  const {
    coordinates,
    administrativeRegionName,
    queryResults,
    docxInterferenceTableRows,
    analysisDateTime, // Usaremos para o cabeçalho
    
  } = data;
  const docChildren: (Paragraph | Table)[] = [];

  // 1. Nome do Relatório
  docChildren.push(
    new Paragraph({
      text: "Relatório UGM Nº XXX/20XX", // Nome do relatório
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    })
  );

  // 2. Região Administrativa
  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Região Administrativa: ", bold: true }),
        new TextRun(administrativeRegionName || 'Não identificada'),
      ],
      spacing: { after: 100 }, // Ajustado o espaçamento
    })
  );

  const footnoteIdCoordinates = 1; // ID único para nossa nota de rodapé de exemplo

  // 3. Coordenadas
  docChildren.push(
      new Paragraph({
        children: [
        new TextRun({ text: "Coordenadas Consultadas (WGS84): ", bold: true }),
        new TextRun(`${coordinates.lat}, ${coordinates.lon}`),
        new FootnoteReferenceRun(footnoteIdCoordinates), // Adiciona a referência da nota de rodapé aqui
        ],
      spacing: { after: 200 }, // Ajustado o espaçamento
    })
  );
  // Imagem Principal (placeholder) - MOVIMENTADO PARA ANTES DO RESUMO DE INTERFERÊNCIAS
  // E DEPOIS DAS COORDENADAS
  // Sempre adiciona o placeholder para inserção manual da imagem.
  docChildren.push(createPlaceholderImageParagraph());

  // 4. Relatório Descritivo
  // Esta seção agora vem após as informações iniciais e o placeholder da imagem principal.

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

  // Subseção: Conclusão e Recomendações
  descriptiveReportSection.push(new Paragraph({ children: [new TextRun({ text: "Conclusão e Recomendações:", bold: true })], spacing: { after: 100, before: 150 } }));
  descriptiveReportSection.push(new Paragraph({ children: [new TextRun({ text: "[Inserir aqui conclusões e recomendações finais...]", italics: true, color: "7F7F7F" })], spacing: { after: 150 } }));

  // Adicionamos a seção descritiva:
  docChildren.push(...descriptiveReportSection);

  // 5. Detalhes por Camada Consultada (agora adicionado após o Relatório Descritivo)
  docChildren.push(
    new Paragraph({
      text: "Detalhes por Camada Consultada",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      pageBreakBefore: true, 
      spacing: { before: 400, after: 200 }, 
    })
  );

  let processedIntersectionCount = 0; // Contador para camadas com interseção que serão exibidas
  queryResults.forEach((result) => {
    if (result.hasIntersection) { // Mostrar detalhes apenas se houver interseção
      const layerNameParagraphOptions: ConstructorParameters<typeof Paragraph>[0] = {
        text: `Camada: ${result.layerName}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 150 }, // Espaçamento antes do nome da camada
      };

      // Adicionar quebra de página antes desta camada se não for a primeira camada com interseção
      // A seção "Detalhes por Camada Consultada" já garante que a primeira camada com interseção
      // comece em uma nova página.
      if (processedIntersectionCount > 0) {
        layerNameParagraphOptions.pageBreakBefore = true;
      }

      docChildren.push(
        new Paragraph(layerNameParagraphOptions)
      );

      // Adiciona placeholder para imagem da camada
      docChildren.push(createLayerImagePlaceholderParagraph());
      if (result.features && result.features.length > 0) {
        result.features.forEach((feature) => {
          // Se a feição contiver uma propriedade 'error', exibir como status
          if (feature.error) {
            docChildren.push(
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
              docChildren.push(
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
              docChildren.push(new Paragraph({ spacing: { after: 200 } })); // Espaço após a tabela de atributos
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

  // A nota de rodapé das fontes foi movida para o rodapé da página (Footer)
  // Definição do Cabeçalho Padrão
  const headerCellStyle = {
    shading: {
      fill: "052440", // Cor de fundo azul escuro (#052440)
      val: ShadingType.CLEAR,
      color: "auto",
    },
    verticalAlign: VerticalAlign.CENTER,
  };

  const reportHeader = new Header({
    // Usaremos uma tabela para alinhar o ícone à esquerda e os textos à direita
    children: [
      new Table({
        columnWidths: [1500, 8000], // Ajuste conforme o tamanho do seu ícone e texto
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
            children: [
              new TableCell({ 
                ...headerCellStyle, // Aplicar estilo de fundo e alinhamento
                children: [
                  new Paragraph({
                    children: [
                      // Placeholder para o ícone. Veja a nota abaixo sobre como adicionar uma imagem real.
                      new TextRun({ text: "[ÍCONE AQUI]", italics: true, color: "FFFFFF", size: 18 }), // Texto branco
                    ],
                    alignment: AlignmentType.LEFT,
                  }),
                ],
              }),
              new TableCell({ 
                ...headerCellStyle, // Aplicar estilo de fundo e alinhamento
                children: [
                  new Paragraph({ 
                    children: [
                      new TextRun({ text: "SECRETARIA DE ESTADO DA PROTEÇÃO URBANÍSTICA DO DISTRITO FEDERAL - DF LEGAL", bold: true, color: "FFFFFF", size: 20 }) // Texto branco, fonte 11pt
                    ],
                    style: "Heading3", 
                    alignment: AlignmentType.RIGHT, 
                    spacing: { after: 15 } // Espaçamento reduzido
                  }),
                  new Paragraph({ 
                    children: [
                      new TextRun({ text: "UNIDADE DE GEOPROCESSAMENTO E MONITORAMENTO - UGMON", color: "FFFFFF", size: 18 }) // Texto branco, fonte 10pt
                    ],
                    style: "IntenseQuote", 
                    alignment: AlignmentType.RIGHT, 
                    spacing: { after: 15 } // Espaçamento reduzido
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Relatório de Consulta ${analysisDateTime ? `- ${analysisDateTime}` : ''}`,
                        italics: true,
                        color: "FFFFFF", // Texto branco
                        size: 18, // 9pt
                      }),
                    ],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      // Adiciona uma linha horizontal simples abaixo do texto do cabeçalho
      new Paragraph({
        border: { bottom: { color: "FFFFFF", space: 1, style: BorderStyle.SINGLE, size: 6 } }, // Linha branca
        spacing: { before: 50 } // Espaço reduzido antes da linha
      }),
    ],
  });

  // Definição do Rodapé Padrão (com as Fontes Consultadas)
  const reportFooter = new Footer({
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
    ],
  });

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
  const doc = new Document({
    footnotes: reportFootnotes, // Adiciona as definições de notas de rodapé ao documento
    sections: [{
      headers: { default: reportHeader }, 
      footers: { default: reportFooter }, // Adiciona o rodapé padrão à seção
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 }, // Margens de ~0.5 polegada
        },
      },
      children: docChildren, // Agora contém todos os elementos
    }],
  });
  return Packer.toBuffer(doc);
}
