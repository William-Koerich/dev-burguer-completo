'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Adiciona a coluna 'category_id' na tabela 'products'
    await queryInterface.addColumn('products', 'category_id', {
      type: Sequelize.INTEGER, // O ID da categoria é INTEGER
      references: {
        model: 'categories', // Referencia a tabela 'categories'
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  async down (queryInterface) {
    // Remove a coluna em caso de rollback
    await queryInterface.removeColumn('products', 'category_id');
  }
};
