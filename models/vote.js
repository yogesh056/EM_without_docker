'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    UserId:DataTypes.INTEGER,
    EventId:DataTypes.INTEGER,
    voteBool: DataTypes.BOOLEAN
  }, {});
  Vote.associate = function(models) {
    // associations can be defined here
    Vote.belongsTo(models.Event, {foreignKey: 'EventId', as: 'event'})
    Vote.belongsTo(models.User, {foreignKey: 'UserId', as: 'user'})


  };
  return Vote;
};