
# Estrutura de pastas e arquivos em `/src`

## ``/models``
Essa pasta contém os tipos e interfaces do TypeScript. As entidades ``QueryResult``, ``QueryResultFeature`` e ``ReportData`` são armazenadas aqui.

## ``/services``
Manipulação dos documentos da pasta templates para a criação do arquivo docx acontece no arquivo ``reportGenerator.ts``. Nesta pasta estão contidos os arquivos referentes à regra de negócio.

## ``/templates``
"Modelos" de documentos. A estruturação do Cabeçalho, parágrafo, rodapé e etc acontecem aqui.

----

### Arquivos em ``/templates``

#### 1. `ReportName.ts`
Template de parágrafo com o nome do relatório.
![alt text](images\reportName.png)

#### 2. `LocationTable.ts`
Template de tabela com informações sobre localização da área no relatório.
![alt text](images\LocationTable.png)

#### 3. `PlaceholderParagraph.ts`
Template de imagem da localização da área no mapa.
![alt text](images\PlaceholderParagraphImage.png)

#### 4. `DescriptiveReportSection.ts`
Template do relatório descritivo da área analisada.
![alt text](images\DescriptiveReportSection.png)

#### 5. `DetailsLayer.ts`
Template das informações das camadas consultadas.
![alt text](images\DetailsLayer.png)

#### 6. `ConclusionReport.ts`
Template das observações finais do relatório.
![alt text](images\ConclusionReport.png)

#### 7. `Header.ts`
Template do cabeçalho do relatório.
![alt text](images\Header.png)

#### 8. `Footer.ts`
Template do rodapé do relatório.
![alt text](images\Footer.png)

#### 9. `ReportDocument.ts`
Cria o documento final `.docx` com todas as informações anteriores.

