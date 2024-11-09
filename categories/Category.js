const Sequelize = require('sequelize')
const connection = require('../databases/database')

const Category = connection.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

// Category.sync({force: true}) -> Serve criar as tabelas, porem, quando forem criadas recomenda-se apagar este codigo, porque ele sempre tenta criar tabelas quando o programa é inicializado, diferente do "force: false" que quando encontra tabelas identicas ja criadas no banco de dados não força a criação delas 

module.exports = Category