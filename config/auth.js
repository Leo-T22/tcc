const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Model de usuarios
require("../models/Account")
const Account = mongoose.model("accounts")

module.exports = passport => {
    passport.use(new localStrategy({
        usernameField: 'user',
         passwordField: 'pass'
    }, (user, pass, done) => {
        Account.findOne({
            userName: user
        }).then((account) => {
            if(!account){
                console.log("this account doesnt exist")
                return done(null, false, {message: "Esta conta não existe"})
            }
            
             bcrypt.compare(pass, account.password, (erro, equal) => {
                 if(equal){
                    console.log("igual")
                     return done(null, account)
                 }else{
                    console.log("diferente")
                    return done(null, false, {message: "Senha incorreta"})
                     
                 }        
             })

        }).catch((err) => {
            console.log("Ocorreu um erro: " + err)
        })
    }))

    passport.serializeUser((account, done) => {
        done(null, account.id)
    })

    passport.deserializeUser((id, done) => {
        Account.findById(id, (err, account) => {
            done(err,account)
        })
    })
}