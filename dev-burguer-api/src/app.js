import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import routes from './routes.js';
import './database/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());

    // Caminho da pasta de uploads
    const uploadPath = path.resolve(__dirname, '..', 'uploads');
    
    // Padronizando para usar apenas '/files' para tudo
    // Isso evita confusão e deixa o código mais limpo
    this.app.use('/files', express.static(uploadPath));
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().app;