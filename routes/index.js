var express = require('express');
var router = express.Router();
var Posts = require('../models/Posts.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  let isLogin = false;
  let username = null;
  if (req.session.user){
    isLogin = true;
    username = req.session.user.username;
  }
    Posts.findAll().then(posts => {
        res.render('blog', { title: 'Blog', posts: posts, isLogin: isLogin, username: username });
    })
});

module.exports = router;
