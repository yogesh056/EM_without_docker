'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    UserId:DataTypes.INTEGER,
    name: DataTypes.STRING,
    state: DataTypes.STRING,
    district: DataTypes.STRING,
    locality: DataTypes.STRING,
    cateogory: DataTypes.STRING,
    geoLocation:DataTypes.ARRAY(DataTypes.DECIMAL),
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
    views:DataTypes.INTEGER,
    start_date: DataTypes.DATEONLY,
  }, {});
  Event.associate = function(models) {
    // associations can be defined here
    Event.belongsTo(models.User, {foreignKey: 'UserId', as: 'user'})
    Event.hasMany(models.Vote, {as: 'votes'})
    Event.hasMany(models.Comment, {as: 'comments'})


  };
  return Event;
};