const Sequelize = require('sequelize')
const connection = require('../databases/database')
const Category = require('../categories/Category')

const Articles = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    text: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Articles) // hasmany() -> relação de um para muitos
Articles.belongsTo(Category) // belongsTo() -> relação de um para um 

// Articles.sync({force: true}) -> Serve criar as tabelas, porem, quando forem criadas recomenda-se apagar este codigo, porque ele sempre tenta criar tabelas quando o programa é inicializado, diferente do "force: false" que quando encontra tabelas identicas ja criadas no banco de dados não força a criação delas 

module.exports = Articles