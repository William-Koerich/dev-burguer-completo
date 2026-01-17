import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        // 1. Definição do ID UUID para casar com a migration (SEM defaultValue)
        // O valor será gerado no Controller para maior segurança.
        id: { 
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
        },
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password_hash: DataTypes.STRING,
        
        // 2. Campo 'admin' com valor padrão
        admin: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        
        // 3. Campo virtual para receber a senha (SEM allowNull: false, crucial para o create)
        password: {
          type: DataTypes.VIRTUAL,
        },
      },
      {
        sequelize,
        tableName: 'users',
      }
    );
    
    // GANCHO (Hook) para criptografar a senha ANTES de salvar no banco
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // Método para verificar se a senha está correta
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;