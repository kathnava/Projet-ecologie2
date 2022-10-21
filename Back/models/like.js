'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Like.belongsTo(models.User,{
        as: 'User', foreignkey: 'userId',
        onDelete: 'CASCADE'
      })
      models.Like.belongsTo(models.Post,{
        as: 'Post', foreignkey: 'postId',
        onDelete: 'CASCADE'
      })
       models.User.belongsToMany(models.Post, {
       through: models.Like,
        foreignKey: 'userId',
        otherkey: 'postId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
      models.Post.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'postId',
        otherkey: 'userId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    }
  }
  Like.init({
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};