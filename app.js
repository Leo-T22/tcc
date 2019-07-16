    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const passport = require("passport");
    require("./config/auth")(passport)
    //app
    const app = express()

// routes
    const admin_panel = require("./routes/admin_panel")
    const manager_panel = require("./routes/manager_panel")


    const path = require('path')
    const mongoose = require("mongoose")
    const session = require("express-session")
    const flash = require("connect-flash")

//config
    //sessão
        app.use(session({
            secret: "cursonode",
            resave : true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())

    //middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.user = req.user || null;
            next()
        })

    //body parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
        
    //handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars');
    
    //mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/dbtcc", { useNewUrlParser: true }).then(() => {
            console.log("connected!")
        }).catch((err) => {
            console.log("connection error: "+err)
        })

    // Public
        app.use(express.static(path.join(__dirname, 'public')));

    // Routes
        //home
        app.get('/', (req, res) => {
            res.render('index')
        })
    
        // login
        app.get('/login', (req, res) => {
            if(req.isAuthenticated()){
                res.redirect('/');
            }else{
                res.render('usuarios/login');
            }               
        })

        app.post('/login', (req, res, next) => {
            passport.authenticate('local', {
                successRedirect: '/verify',
                failureRedirect: './login',
                failureFlash: true
            })(req,res,next)
        })

        // verify
        app.get('/verify', (req, res) => {
            if (req.isAuthenticated() && req.user.privilege == 1) {
                res.redirect("./admin_panel")
            }else if (req.isAuthenticated() && req.user.privilege == 0) {
                res.redirect("./manager_panel")
            }
        })

        // External routes
            app.use('/admin_panel', admin_panel);
            app.use('/manager_panel', manager_panel);        

        // Logout
        app.get('/logout', (req, res) => {
            if(req.isAuthenticated()){
                req.logout();
                req.flash('success_msg', 'Deslogado com sucesso');
            } 
            res.redirect('/');
        });

        // Error 404
            app.get('*', (req, res) => {
                res.send("<h1>Error 404</h1><p>Page Not Found</p>")
            });

//Port definition
        const PORT = process.env.PORT || 3000;
            app.listen(PORT, () => {
                console.log('Server running...');
            });