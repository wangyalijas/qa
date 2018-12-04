'use strict';
module.exports = (sequelize, DataTypes) => {
  const Selection = sequelize.define('Selection', {
    name: DataTypes.STRING,
    sort: DataTypes.INTEGER,
    type: DataTypes.STRING,
    questionnaireId: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {});
  Selection.associate = function(models) {
    this.Options = this.hasMany(models.Option, {
      as: 'options',
      sourceKey: 'id',
      foreignKey: 'selectionId'
    })
  };
  return Selection;
};
