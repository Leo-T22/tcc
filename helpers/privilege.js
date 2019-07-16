// Exportação
module.exports = {
    isAdmin: function(req, res, next) {
        if (req.isAuthenticated() && req.user.privilege == 1) {
            return next()
        }

        req.flash("error_msg", "Você precisa ter privilégio de Administrador para acessar este conteúdo!")
    },

    isManager: function(req, res, next) {
        if (req.isAuthenticated() && req.user.privilege == 0) {
            return next()
        }

        req.flash("error_msg", "Você precisa ter privilégio de Gestor para acessar este conteúdo!")
    }
}