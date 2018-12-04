'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Results', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      GUID: {
        type: Sequelize.STRING
      },
      ip: {
        type: Sequelize.STRING
      },
      questionnaireId: {
        type: Sequelize.STRING
      },
      selectionId: {
        type: Sequelize.INTEGER
      },
      answerId: {
        type: Sequelize.INTEGER
      },
      optionId: {
        type: Sequelize.INTEGER
      },
      answerContent: {
        type: Sequelize.TEXT
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
    return queryInterface.dropTable('Results');
  }
};