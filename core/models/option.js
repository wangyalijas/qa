'use strict';
module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define('Option', {
    name: DataTypes.STRING,
    selectionId: DataTypes.INTEGER,
    sort: DataTypes.INTEGER,
    isRight: DataTypes.BOOLEAN,
    isActive: DataTypes.BOOLEAN
  }, {});
  Option.associate = function(models) {
    this.OptionResults = this.hasMany(models.Result, {
      as: 'result',
      targetKey: 'id',
      foreignKey: 'optionId'
    })
  };
  return Option;
};
