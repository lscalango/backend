import express from 'express';
import cors from 'cors';
import { generateDocxReport, ReportData } from './reportGenerator'; // Você criará este arquivo

const app = express();
const port = process.env.PORT || 3005; // Porta para o backend

app.use(cors()); // Habilita CORS para todas as rotas
// Middleware para parsear JSON no corpo das requisições, com limite aumentado
app.use(express.json({ limit: '50mb' })); 
// Middleware para parsear corpos URL-encoded, também com limite aumentado (bom ter por consistência)
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.post('/api/generate-report-docx', async (req, res) => {
  try {
    const reportData = req.body as ReportData; // Dados enviados pelo frontend
    if (!reportData || !reportData.coordinates || !reportData.queryResults) {
      // Log para dados insuficientes
      console.log("Backend: Recebido pedido para gerar DOCX, mas dados são insuficientes:", reportData);
      return res.status(400).send({ message: 'Dados insuficientes para gerar o relatório.' });
    }

    // Log para verificar o mapImageDataUrl recebido pelo servidor
    console.log("Backend: mapImageDataUrl recebido:", reportData.mapImageDataUrl ? reportData.mapImageDataUrl.substring(0, 100) + "..." : "null");

    const buffer = await generateDocxReport(reportData);

    res.setHeader('Content-Disposition', 'attachment; filename=relatorio_consulta.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (error) {
    console.error("Erro ao gerar DOCX:", error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no servidor.';
    res.status(500).send({ message: 'Falha ao gerar o relatório DOCX.', details: errorMessage });
  }
});

app.listen(port, () => {
  console.log(`Servidor de backend para relatórios rodando em http://localhost:${port}`);
});
