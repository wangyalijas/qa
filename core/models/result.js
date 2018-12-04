'use strict';
module.exports = (sequelize, DataTypes) => {
  const Result = sequelize.define('Result', {
    GUID: DataTypes.STRING,
    ip: DataTypes.STRING,
    questionnaireId: DataTypes.STRING,
    selectionId: DataTypes.INTEGER,
    answerId: DataTypes.INTEGER,
    optionId: DataTypes.INTEGER,
    answerContent: DataTypes.TEXT,
    isActive: DataTypes.BOOLEAN
  }, {});
  Result.associate = function (models) {
    
  };
  return Result;
};