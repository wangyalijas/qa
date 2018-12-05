'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserEntities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userNo: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      company: {
        type: Sequelize.STRING
      },
      department: {
        type: Sequelize.STRING
      },
      job: {
        type: Sequelize.STRING
      },
      directorNo: {
        type: Sequelize.STRING
      },
      directorName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('UserEntities');
  }
};