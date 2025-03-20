const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Group extends Model{

    static async findGroup(id){
        try {
            const group = await Group.findByPk(id)
            return group ? group : null
        } catch (error) {
            console.log(error)
            return null
        }
    }

    static async addUserToGroup(groupid, username){
        try {
            var data = {username: username}
            const group = await Group.findByPk(groupid)
            if(group){
                group.groupmembers.append(data)
                await group.save()
                return group
            }else{
                return null
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

// Use Crypto or BCrypt to encrypt user data
Group.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expdate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    groupbio: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    groupid: {
      type: DataTypes.INTEGER, 
      primaryKey: true,
      allowNull: false
    }
  }, {
    sequelize, 
    modelName: 'Group'
  });

module.exports = Group