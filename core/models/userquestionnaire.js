'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserQuestionnaire = sequelize.define('UserQuestionnaire', {
    userNo: DataTypes.STRING,
    questionnaireId: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {});
  UserQuestionnaire.associate = function(models) {
    // associations can be defined here
  };
  return UserQuestionnaire;
};