
const path = require('path');
const express = require('express'); // <<< CORREÇÃO: Importar o Express

// Caminho para a pasta onde o multer armazena os uploads
const uploadPath = path.resolve(__dirname, '..', '..', 'uploads');

// Configuração para servir arquivos estáticos
const fileRouteConfig = express.static(uploadPath);

module.exports = fileRouteConfig;