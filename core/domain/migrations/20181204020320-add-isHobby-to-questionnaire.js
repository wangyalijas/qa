'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Questionnaires', 'isHobby', {
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    })

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Questionnaires');
  }
};
