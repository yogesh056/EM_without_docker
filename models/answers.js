'use strict';
module.exports = (sequelize, DataTypes) => {
  const Answers = sequelize.define('Answers', {
    UserId:DataTypes.INTEGER,
    QuestionId:DataTypes.INTEGER,
    description: DataTypes.TEXT,
    vote:DataTypes.INTEGER,
  }, {});
  Answers.associate = function(models) {
    // associations can be defined here 
    Answers.belongsTo(models.Questions, {foreignKey: 'QuestionId', as: 'questions'})
    Answers.belongsTo(models.User, {foreignKey: 'UserId', as: 'user'})
    Answers.hasMany(models.AnswerVote, {as: 'answerVote'})    
  };
  return Answers;
};