'use strict';
module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define('Questions', {
    UserId:DataTypes.INTEGER,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    cateogory: DataTypes.STRING
  }, {});
  Questions.associate = function(models) {
    // associations can be defined here
    Questions.belongsTo(models.User, {foreignKey: 'UserId', as: 'user'})
    Questions.hasMany(models.Answers, {as: 'answers'})
  };
  return Questions;
};