var Users = require('../models/Users');
module.exports = function isAuthorized (req, res, next){
    //if use have not login yet
    if (req.session.user == null || !req.session.user){
        res.redirect('/users/login')
    }
    Users.findById(req.session.user.id).then(user => {
        return next()
    })
}