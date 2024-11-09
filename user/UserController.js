const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')
const AdminAuth = require('../middlewares/AdminAuth')


// Renderiza pagina de listagem de todos os usuarios 
router.get('/admin/users', AdminAuth, (req, res) => {
    User.findAll().then(users => {
        if(users != undefined){
            res.render('../views/admin/users/index.ejs', {users: users})
        }
        else{
            res.redirect('/')
        }
    })
})



// Renderiza a pagina de criação de usuarios 
router.get('/admin/users/create', AdminAuth, (req, res) => {
    res.render('../views/admin/users/create.ejs')
})



// Cadatra novos usuarios 
router.post('/admin/users/save', (req, res) => {
    var email = req.body.email
    var password = req.body.password

    User.findOne({
        where: {
            email: email
        }
    }).then(users => {
        if(users != undefined){ // medida de segurança para saber se um email ja foi cadastrado
            res.redirect("/admin/users")
        }
        else{
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(password, salt)
        
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/admin/users")
            }).catch(error => {
                res.redirect("/admin/users")
            })
        }
    })
})



// Deleta usuarios 
router.post('/admin/users/delete/:id', AdminAuth, (req, res) => {
    var id = req.params.id
    if(id != undefined){
        if(isNaN(id)){
            res.redirect("/admin/users")
        }
        else{
            User.destroy({
                where: {id: id}
            }).then(() => {
                res.redirect("/admin/users")
            })
        }
    }
    else{
        res.redirect("/admin/users")
    }
})



// Renderiza pagina de atualização dos usuarios
router.get('/admin/users/update/:id', AdminAuth, (req, res) => {
    var id = req.params.id
    User.findAll({
        where: {
            id:id
        }
    }).then(users => {
        res.render('../views/admin/users/UserUpdate.ejs', {users: users})
    }).catch(error => {
        res.redirect('/admin/users')
    })
})



// Salva as alterações do usuario
router.post('/admin/users/save/update', (req, res) => {
    var email = req.body.email
    var password = req.body.password
    var id = req.body.id
    if(email && password && id != undefined){
        User.findAll({
            where: {
                email: email,
                password: password
            }
        }).then(details => {
            if(details != undefined){
                var salt = bcrypt.genSaltSync(10)
                var hash = bcrypt.hashSync(password, salt)
            
                User.update({
                    email: email,
                    password: hash
                    },{
                    where: {
                        id: id
                    }
                    }).then(() => {
                    res.redirect("/admin/users")
                }).catch(error => {
                    res.redirect('/admin/users/update/' + id)
                })
            }
            else{
                res.redirect('/admin/users/update/' + id)
            }
        })
    }
    else{
        res.redirect('/admin/users/update/' + id)
    }
})



// Renderiza a tela de login
router.get('/users/login', (req, res) => {
    res.render('../views/admin/users/login.ejs')
})


// Autenticação de login
router.post('/authenticated', (req, res) => {
    var email = req.body.email
    var password = req.body.password

    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if(user != undefined){
            var correct = bcrypt.compareSync(password, user.password)
            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/')
            }
            else{
                res.redirect('/users/login')
            }
        }
        else{
            res.redirect('/users/login')
        }
    })
})




router.get("/users/logouth", (req, res) => {
    req.session.user = undefined
    res.redirect('/users/login')
}) 



module.exports = router