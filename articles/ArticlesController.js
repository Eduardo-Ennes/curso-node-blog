const express = require('express')
const router = express.Router()
const category = require('../categories/Category')
const article = require('./Articles')
const slugify = require('slugify')
const AdminAuth = require('../middlewares/AdminAuth')


// Renderiza a pagina que mostra os artigos
router.get('/admin/articles', AdminAuth , (req, res)=>{
    article.findAll({
        include: ({model: category}),
        order: [['ID', 'DESC']]
    }).then(articles => {
        res.render('../views/admin/articles/index.ejs', {articles: articles})
    })
})



// Renderiza a pagina de criação dos artigos
router.get('/articles/new', (req, res)=>{
    category.findAll().then(categories =>{
        res.render('../views/admin/articles/news.ejs', {categories: categories})
    })
})



// Salva artigos criados 
router.post('/articles/save', (req, res)=>{
    var title = req.body.title
    var contein = req.body.body
    var category = req.body.categoria
    article.create({
        title: title,
        slug: slugify(title),
        text: contein,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles")
    })
})



// Deleta artigos criados 
router.post('/articles/delete', (req, res) => {
    var id = req.body.id
    if (id != undefined){
        if (isNaN(id)){
            res.redirect("/admin/articles")
        }
        else{
            article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/articles')
            })
        }
    }
    else{
        res.redirect('/admin/articles')
    }
})



// Renderiza a pagina de edição dos articles
router.get('/articles/edit/:id', AdminAuth, (req, res) => {
    var id = req.params.id
    if (isNaN(id)){
        res.redirect('/admin/articles')
    }
    else{
        article.findByPk(id).then(articles => {
            if(articles != undefined){
                category.findAll().then(categories => {
                    if(categories != undefined){
                        res.render('../views/admin/articles/edit.ejs', {article: articles, categories: categories})
                    }
                    else{
                        res.redirect('/admin/articles')
                    }
                })
            }
            else{
                res.redirect('/admin/articles')
            }
        }).catch(error => {
            res.redirect('/admin/articles')
        })
    }
})



// Atualiza os dados dos articles
router.post('/articles/update', (req, res) => {
    var title = req.body.title
    var id = req.body.article_id
    var text = req.body.body
    var category = req.body.categoria
    article.update({
        title: title,
        slug: slugify(title),
        text: text,
        categoryId: category
    },{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/articles')
    }).catch(error => {
        res.redirect('/admin/articles')
    })
})



// Logica de toda paginação 
router.get('/articles/pagination/:num', (req, res) => {
    var page = req.params.num
    var offset = 0
    if(isNaN(page) || page == 1){
        offset = 0
    }
    else{
        offset = (parseInt(page) - 1) * 4
    }

    article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [['id', 'DESC']]
    }).then(articles => {
        var next;
        if(offset + 4 >= articles.count){
            next = false
        }
        else{
            next = true
        }
        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }
        category.findAll().then(categories => {
            res.render('../views/admin/articles/page.ejs', {result: result, categories: categories})
        })
    })
})



module.exports = router