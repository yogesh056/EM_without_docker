'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    UserId:DataTypes.INTEGER,
    EventId:DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
    Comment.belongsTo(models.Event, {foreignKey: 'EventId', as: 'event'})
    Comment.belongsTo(models.User, {foreignKey: 'UserId', as: 'user'})
  };
  return Comment;
};