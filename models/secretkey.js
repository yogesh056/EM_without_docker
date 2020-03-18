'use strict';
module.exports = (sequelize, DataTypes) => {
  const SecretKey = sequelize.define('SecretKey', {
    Email:DataTypes.STRING,
    secret_key: DataTypes.INTEGER
  }, {});
  SecretKey.associate = function(models) {
    // associations can be defined here
    SecretKey.belongsTo(models.User, {foreignKey: 'email', as: 'user'})
  };
  return SecretKey;
};