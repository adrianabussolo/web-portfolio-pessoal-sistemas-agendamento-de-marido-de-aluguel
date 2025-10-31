const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = 4000;

app.use(express.json());

// Servir swagger.yaml estaticamente
app.use('/resources/swagger.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, 'resources', 'swagger.yaml'));
});

app.use(express.static(path.join(__dirname, 'public')));

// Proxy para API backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {'^/api': ''}
}));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Swagger UI (documentação interativa)
app.use('/docs', express.static(path.join(__dirname, 'public', 'docs')));

app.listen(PORT, () => {
  console.log(`Web app rodando em http://localhost:${PORT}`);
});
