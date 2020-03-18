'use strict';
module.exports = (sequelize, DataTypes) => {
  const AnswerVote = sequelize.define('AnswerVote', {
    UserId:DataTypes.INTEGER,
    AnswerId: DataTypes.INTEGER,
    voteBool: DataTypes.BOOLEAN
  }, {});
  AnswerVote.associate = function(models) {
    // associations can be defined here
    AnswerVote.belongsTo(models.Answers, {foreignKey: 'AnswerId', as: 'answer'})
    AnswerVote.belongsTo(models.User, {foreignKey: 'UserId', as: 'user'})

  };
  return AnswerVote;
};