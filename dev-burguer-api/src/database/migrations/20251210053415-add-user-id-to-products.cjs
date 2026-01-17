'use strict';
// Use Sequelize.DataTypes se o arquivo for .js ou .cjs
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'user_id', {
      // 🛑 CORRIGIDO: MUDAR PARA Sequelize.UUID (ou o tipo correto do ID de users)
      type: Sequelize.UUID, 
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', 
      allowNull: true, 
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('products', 'user_id');
  },
};