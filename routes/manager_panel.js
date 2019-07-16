// Require 
    // módulos
    const mongoose = require('mongoose');
    const express = require('express');
    const router = express.Router();
    require("../models/Page")
// Model
    const Page = mongoose.model('pages');
// Helpers
    const {isManager} = require('../helpers/privilege')

// erros
//const erroInterno = 'Houve um erro interno';

// manager panel index
router.get("/", isManager, (req, res) => {
    res.render("manager_panel/index")
})

// manage pages
router.get("/managepage", isManager, (req, res) => {
    Page.find().then((pages) => {
        res.render("manager_panel/managepage", {pages: pages})
    }).catch((err) => {
        console.log("erro ao listar os usuarios: " + err)
    })
})

// add pages
router.get("/managepage/add", isManager, (req, res) => {
    res.render("manager_panel/managepageadd")
})

router.post("/managepage/new", isManager, (req, res) => {
    const newPage = {
        title: req.body.title,
        content: req.body.content
    }

    new Page(newPage).save().then(() => {
        console.log("nova postagem!")
        res.redirect("/manager_panel/managepage")
    }).catch((err) => {
        console.log("erro ao criar pagina :( "+err)
    })
})

// edit pages
router.get("/managepage/edit/:id", isManager, (req, res) => {
    Account.findOne({_id: req.params.id}).then((accounts) => {
        res.render("admin_panel/manageuseredit", {accounts: accounts})
    }).catch((err) => {
        console.log("erro ao editar o usuario: "+err)
        res.redirect("/admin_panel/manageuser")
    })
})

module.exports = router; 