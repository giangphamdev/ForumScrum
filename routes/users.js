const express = require('express');
var router = express.Router();
var Users = require('../models/Users');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/')
});
router.get('/signup', (req, res) => {
  if (req.session.user)
    res.redirect('/')
  res.render('signup',{ title: 'Sign Up','error':'', isLogin: false })
});
router.post('/signup', (req, res) => {
  username = req.body.username;
  email = req.body.email;
  password1 = req.body.password1;
  password2 = req.body.password2;
  if (!username || !email || !password1 || !password2 ) {
    return res.render('signup',{ title: 'Sign Up','error':'Yêu cầu nhập thông tin đầy đủ', isLogin: false})
  }
  if (!/^[a-zA-Z0-9]*$/.test(username))
    return res.render('signup',{ title: 'Sign Up','error':'Tài khoản có kí tự đặc biệt', isLogin: false})
  if (password1 !== password2)
    return res.render('signup',{ title: 'Sign Up','error':'Mật khẩu không trùng nhau', isLogin: false})
  if (!/\S+@\S+[\.\S+]*/.test(email))
    return res.render('signup',{ title: 'Sign Up','error':'Email không hợp lệ', isLogin: false})
    
  var userData = {
    username: username,
    email: email,
    password: password1
  }
  Users.create(userData);
  Users.findOne({where: {username: username}}).then(user => {
      req.session.user = user;
      res.redirect('/blog')
  });
})
router.get('/login', (req, res) => {
  if (req.session.user)
    return res.redirect('/blog')
  res.render('login',{ title: 'Login','error':'', isLogin: false })
})
router.post('/login', (req, res) => {
  username = req.body.username;
  password = req.body.password;
  Users.findOne({where: {username: username}}).then(user => {
    isMatch = user.comparePassword(password);
    if (isMatch) {
      //save user in session
      req.session.user = user;
      res.redirect('/blog')
    } else res.render('login',{ title: 'Login','error':'Mật khẩu không chính xác', isLogin: false  })
  }).catch(err => {
    res.render('login',{ title: 'Login','error':'Tài khoản hoặc mật khẩu không đúng', isLogin: false  })
  })
});
router.get('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/blog')
})
router.get('/:username', (req, res) => {
  let profileName = req.params.username;
  let isLogin = false;
  let username = null;
  if (req.session.user){
    isLogin = true;
    username = req.session.user.username;
  }
  Users.findOne({where: {username: profileName}}).then(user => {
    let email = user.email;
    res.render('contact',{ title: 'Profile',isLogin: isLogin, username: username, email: email, profileName: profileName});
  });
})
module.exports = router;