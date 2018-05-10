var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    let isLogin = false
    if (req.session.user){
        isLogin = true;
        username = req.session.user.username;
        email = req.session.user.email;
    }
    res.render('contact', { title: 'Contact', isLogin: isLogin, username: username, email: email })
});
module.exports = router;