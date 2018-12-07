'use strict';
module.exports = (sequelize, DataTypes) => {
  const Courseware = sequelize.define('Courseware', {
    name: DataTypes.STRING,
    path: DataTypes.STRING,
    cover: DataTypes.STRING,
    questionnaireId: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {});
  Courseware.associate = function(models) {
    // associations can be defined here
  };
  return Courseware;
};
