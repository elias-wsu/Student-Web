const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/studentstudy.sqlite'
})

module.exports = sequelize