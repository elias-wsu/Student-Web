const sequelize = require('../db')
const { Model, DataTypes, Op } = require('sequelize')

class User extends Model{
    static async findUser(username, password){
        try {
            const user = await User.findByPk(username)
            if(user && user.password === password){
                return user
            } else {
                return null
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }

    static async usernameExists(newusername){
      try {
          const user = await User.findOne({ where: {username: newusername}});
          if(user){
              return true
          } else {
              return false
          }
      } catch (error) {
          console.log(error)
          return null
      }
    }

    static async emailExists(username, new_email){
      try {
          const user = await User.findOne({ where: {username: {[Op.not]: username},  email: new_email }});
          if(user){
              return true
          } else {
              return false
          }
      } catch (error) {
          console.log(error)
          return null
      }
    }

}

// Use Crypto or BCrypt to encrypt user data
User.init({
  username: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  school: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: false
  }
  }, {
    sequelize, 
    modelName: 'User'
  });

module.exports = User