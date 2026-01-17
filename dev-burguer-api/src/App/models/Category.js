import Sequelize, { Model } from 'sequelize';

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            // Alterado de 'category-file' para 'files' para padronizar com o teste que deu certo
            return `http://localhost:3001/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
        tableName: 'categories', // É boa prática garantir o nome da tabela
      },
    );

    return this;
  }
}

export default Category;