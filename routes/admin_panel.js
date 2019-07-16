// Require 
    // módulos
    const mongoose = require('mongoose');
    const express = require('express');
    const bcrypt = require('bcryptjs')
    const router = express.Router();
    require("../models/Account")
// Model
    const Account = mongoose.model('accounts');
// Helpers
    const {isAdmin} = require('../helpers/privilege')

// erros
//const erroInterno = 'Houve um erro interno';

// admin panel
router.get("/", isAdmin, (req, res) => {
    res.render("admin_panel/index")
})

// manage account
router.get("/manageuser", isAdmin, (req, res) => {
    Account.find().then((accounts) => {
        res.render("admin_panel/manageuser", {accounts: accounts})
    }).catch((err) => {
        console.log("erro ao listar os usuarios: "+err)
    })
})

// create accounts
router.get("/manageuser/add", isAdmin, (req, res) => {
    res.render("admin_panel/manageuseradd")
})

router.post("/manageuser/new", isAdmin, (req, res) => {
    Account.findOne({userName: req.body.name}).then((account) => {
        if(account){
            console.log("Nome de usuário já existe")
            res.redirect('/')
        }else{
            const newAccount = new Account({
                userName: req.body.name,
                password: req.body.password
            })

            bcrypt.genSalt(10, (erro, salt) => {
                bcrypt.hash(newAccount.password, salt, (erro, hash) => {
                    if(erro)
                        console.log("erro ao encriptar :(")

                    newAccount.password = hash

                    newAccount.save().then(() => {
                        console.log("senha encriptada :)")
                        res.redirect('/admin_panel')
                    }).catch((err) => {
                        console.log("erro ao aplicar: " + err)
                        res.redirect('/admin_panel/manageuser/add')
                    })
                })
            })
        }
    })
})

// edit account
router.get("/manageuser/edit/:id", isAdmin, (req, res) => {
    Account.findOne({_id: req.params.id}).then((accounts) => {
        res.render("admin_panel/manageuseredit", {accounts: accounts})
    }).catch((err) => {
        console.log("erro ao editar o usuario: "+err)
        res.redirect("/admin_panel/manageuser")
    })
})

router.post("/manageuser/edit", isAdmin, (req, res) => {
    Account.findOne({_id: req.body.id}).then((accounts) => {
        accounts.userName = req.body.name
        accounts.password = req.body.password

        accounts.save().then(() => {
        res.redirect("/admin_panel/manageuser")            
        })
    }).catch((err) => {
        console.log("erro ao editar: "+err)
    })
})

// delete account
router.post("/manageuser/delete", isAdmin, (req, res) => {
    Account.remove({_id: req.body.id}).then(() => {
        console.log("conta removida com sucesso!")
        res.redirect("/admin_panel/manageuser")   
    }).catch((err) => {
        console.log("erro ao remover conta: "+err)
    })
})

// log screen
router.get("/logscreen", isAdmin, (req, res) => {
    res.render("./admin_panel/log")
})

// backup screen
router.get("/backupscreen", isAdmin, (req, res) => {
    res.render("./admin_panel/backupscreen")
})

module.exports = router;