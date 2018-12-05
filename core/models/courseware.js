'use strict';
module.exports = (sequelize, DataTypes) => {
  const CourseWare = sequelize.define('CourseWare', {
    name: DataTypes.STRING,
    path: DataTypes.STRING,
    questionnaireId: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {});
  CourseWare.associate = function(models) {
    // associations can be defined here
  };
  return CourseWare;
};