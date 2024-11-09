const express = require('express')
const router = express.Router()
const Category = require("./Category")
const slugify = require('slugify')
const category = require('./Category')
const AdminAuth = require('../middlewares/AdminAuth')


// Apenas renderiza a pagina do formulario
router.get('/admin/categories/new', AdminAuth, (req, res)=>{
    res.render("../views/admin/categories/new.ejs")
})


// Salva as informações do formulario
router.post('/categories/save', (req, res)=>{
    var title = req.body.title
    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories")
        })
    }
    else{
        res.redirect("/admin/categories")
    }
})


// Mostra as categorias
router.get('/admin/categories', AdminAuth, (req, res)=>{
    category.findAll({raw: true, order: [['ID', 'DESC']]}).then(categories => {
        res.render('../views/admin/categories/index.ejs', {
            categories: categories
        })
    })
})


// DELETA CATEGORIA
// Deleta categoria
router.post('/categories/delete', (req, res)=>{
    var id = req.body.id
    if(id != undefined){ // diferente de undefined
        if(isNaN(id)){ // se nãofor um número
            res.redirect("/admin/categories")
        }
        else{ // se for um numero
            category.destroy({
                where: {
                    id: id
                }
            }).then(()=>{
                res.redirect("/admin/categories")
            })
        }
    }
    else{ // se for undefined
        res.redirect("/admin/categories")
    }
})


// ATUALIZAÇÃO DE DADOS
// Pagina de renderização da atualização das categorias
router.get('/admin/categories/edit/:id', AdminAuth, (req, res)=>{
    var id = req.params.id
    if(isNaN(id)){
        res.redirect("/admin/categories")
    }
    else{
        category.findByPk(id).then(categoria => {
            if(categoria != undefined){
                res.render('../views/admin/categories/edit.ejs', {
                    categoria: categoria
                })
            }
            else{
                res.redirect("/admin/categories")
            }
        }).catch(error => {
            res.redirect("/admin/categories")
        })
    }
})


// Apenas atualiza os dados 
router.post('/categories/edit', (req, res)=>{
    var id = req.body.id
    var title = req.body.title
    if (id != undefined){
        category.update({
            title: title, 
            slug: slugify(title)
            }, {
            where: {
                id: id
            }
            }).then(()=>{
                res.redirect("/admin/categories")
            })
    }
    else{
        res.redirect("/admin/categories")
    }
})


module.exports = router