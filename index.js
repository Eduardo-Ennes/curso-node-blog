// configurações do express
const express = require("express")
const app = express()

// consigurações da session
const session = require('express-session')
app.use(session({
    secret: "qualquercoisa", cookie: {maxAge: 30000000}
}))

// configurações da view engine ou ejs
app.set('view engine', 'ejs')

// configurações Body-parse
const bodyParse = require('body-parser')
app.use(bodyParse.urlencoded({extended: false}))
app.use(bodyParse.json())

// static
app.use(express.static('public'))

// importação do banco de dados
const connection = require('./databases/database')

// Router
const router = require('./categories/Controller')
const articlerouter = require('./articles/ArticlesController')
const UserRouter = require('./user/UserController')

// Importação das tabelas 
const Category = require('./categories/Category')
const Articles = require('./articles/Articles')


// ----------------------------------------------------------------------------------------


// conexão com o banco de dados 
connection.authenticate().then(() => {
    console.log('Conexão bem sucedida com o banco de dados!')
}).catch(() => {
    console.log('Algum erro aconteceu na conexão com o banco de dados!')
})



// HOME
app.get("/", (req, res)=>{
    Articles.findAll({
        order: [['id', 'DESC']],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories})
        })
    })
})



app.get('/:slug', (req, res) => {
    var slug = req.params.slug
    Articles.findOne({
        where: {
            slug: slug
        }
    }).then(articles => {
        if(articles != undefined){
            Category.findAll().then(categories => {
                res.render('article', {articles: articles, categories: categories})
            })
        }
        else{
            res.redirect('/')
        }
    }).catch(error => {
        res.redirect('/')
    })
})



app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Articles}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories: categories})
            })  
        }
        else{
            res.redirect('/')
        }
    }).catch((error) => {
        res.redirect('/')
    })
})



/*--------------------------------------------------------------*/


// CONEXÕES ROUTER
app.use('/', router)
app.use('/', articlerouter)
app.use('/', UserRouter)
// --------------------------

// Inicialização da aplicação
app.listen(830, () => {
    console.log('O servidor está rodando')
})
// 830 -> a porta que o projeto será inicializado