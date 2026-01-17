import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';
// IMPORTAÇÃO CRÍTICA FALTANDO ANTERIORMENTE
import config from '../config/database.cjs'; 

import User from '../App/models/User.js';
import Product from '../App/models/Product.js'; 
import Category from '../App/models/Category.js'; 

// Lista de todos os modelos
const models = [User, Product, Category];

class Database {
  constructor() {
    this.init();
    this.mongo();
    // A função associate será chamada após a inicialização dos modelos
    this.associate();
  }

  init() {
    // CORREÇÃO: Inicializa a conexão usando 'new Sequelize' e o objeto 'config' importado.
    this.connection = new Sequelize(config);
    
    // Inicializa todos os modelos
    models.map((model) => model.init(this.connection));
  }

  associate() {
    // Chama o método associate em cada modelo se ele existir.
    models.forEach((model) => {
      // Verifica se o modelo tem o método estático 'associate'
      if (model.associate) { 
        model.associate(this.connection.models);
      }
    });
  }
  mongo() {
    this.mongoConnection = mongoose.connect (
      'mongodb://localhost:27017/devburguer'
    );
  }
}

export default new Database();
