'use strict';
module.exports = (sequelize, DataTypes) => {
  const Questionnaire = sequelize.define('Questionnaire', {
    GUID: DataTypes.STRING,
    name: DataTypes.STRING,
    author: DataTypes.STRING,
    describe: DataTypes.STRING,
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    qrcode: DataTypes.STRING,
    isHobby: DataTypes.BOOLEAN,
    sort: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  }, {});
  Questionnaire.associate = function (models) {
    this.Selections = this.hasMany(models.Selection, {
      as: 'selections',
      sourceKey: 'GUID',
      foreignKey: 'questionnaireId'
    })
    this.Answers = this.hasMany(models.Answer, {
      as: 'answers',
      sourceKey: 'GUID',
      foreignKey: 'questionnaireId'
    })
    this.Results = this.hasMany(models.Result, {
      as: 'Results',
      sourceKey: 'GUID',
      foreignKey: 'questionnaireId'
    })
  };
  return Questionnaire;
};
