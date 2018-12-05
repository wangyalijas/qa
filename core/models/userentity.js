'use strict';
const constantType = require('../../dtos/common/constant')
module.exports = (sequelize, DataTypes) => {
  var UserEntity = sequelize.define('UserEntity', {
    userNo: DataTypes.STRING,
    name: DataTypes.STRING,
    gender: DataTypes.STRING,
    status: DataTypes.STRING,
    company: DataTypes.STRING,
    department: DataTypes.STRING,
    job: DataTypes.STRING,
    directorNo: DataTypes.STRING,
    directorName: DataTypes.STRING,
    email: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {
    defaultScope: {
      where: {
        status: constantType.jobStatus.on
      }
    }
  });
  UserEntity.associate = function (models) {
    // associations can be defined here
  };
  return UserEntity;
};