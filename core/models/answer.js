'use strict';
module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    name: DataTypes.STRING,
    questionnaireId: DataTypes.STRING,
    sort: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  }, {});
  Answer.associate = function (models) {
    this.AnswerResults = this.hasMany(models.Result, {
      as:'result',
      sourceKey: 'id',
      foreignKey: 'answerId'
    })
  };
  return Answer;
};