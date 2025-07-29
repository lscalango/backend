// Interfaces para tipar os dados esperados do frontend
export interface QueryResultFeature {
    [key: string]: any;
    error?: string;
}

export interface QueryResult {
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
    numeroUGM?: string;
    processoSEI?: string;
    endereco?: string;
}