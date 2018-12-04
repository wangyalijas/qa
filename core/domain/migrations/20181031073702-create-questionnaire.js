'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Questionnaires', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      GUID: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      author: {
        type: Sequelize.STRING
      },
      startTime: {
        type: Sequelize.DATE
      },
      endTime: {
        type: Sequelize.DATE
      },
      qrcode: {
        type: Sequelize.STRING
      },
      sort: {
        type: Sequelize.INTEGER
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Questionnaires');
  }
};