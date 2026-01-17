import { Model, DataTypes } from 'sequelize';
import Sequelize from 'sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        price: DataTypes.INTEGER,
        path: DataTypes.STRING,
        category_id: DataTypes.INTEGER,
        offer: Sequelize.BOOLEAN,
        
        // 🛑 NOVO/CORRIGIDO: DEFINIR user_id COMO UUID
        user_id: DataTypes.UUID, 

        url: {
          type: DataTypes.VIRTUAL,
          get() {
            // Assumindo que seu servidor está rodando na porta 3001
            return `http://localhost:3001/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
        tableName: 'products',
      },
    );

    return this;
  }

  static associate(models) {
    // Relação 1:N com Category
    this.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
    // Relação 1:N com User (quem criou o produto)
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}
export default Product;