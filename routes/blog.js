var express = require('express');
var router = express.Router();
var Posts = require('../models/Posts.js');
var Users = require('../models/Users');
var Comments = require('../models/Comments');
var isAuthorized = require('./auth'); //check user is authorized (logined)
/* GET home page. */
router.get('/', function(req, res) {
    res.redirect('/');
});
router.get('/create',isAuthorized, (req, res) => {
    let isLogin = true
    res.render('create', { title: 'Create', 'error': '', isLogin: isLogin })
});
router.post('/create',isAuthorized , (req, res) => {
    let item = {
        title: req.body.title,
        body: req.body.body,
        userId: req.session.user.id,
        rating: 0
    };
    Posts.create(item).then(post => {
        Posts.findOne({
            where: {title: title}
        }).then(post => {
            res.redirect(`/blog/${post.slug}`)
        });
    })
});
router.get('/:slug', (req, res) => {
    let isLogin = false;
    let username = null;
    if (req.session.user){
        isLogin = true;
        username = req.session.user.username;
    }
    let slug = req.params.slug
    Posts.findOne({
        where: {slug: slug}
    }).then(post => {
        let isUpdate = false;
        let authorName;
        if (req.session.user) {
            let userId = req.session.user.id; 
            if (userId == post.userId){
                isUpdate = true;
                authorName = req.session.user.username;
            } 
        }else {
            Users.findOne({where: {id: post.userId}}).then(user => {
                authorName = user.username;
            });
        }
        let listComment = new Array();
        Comments.findAll({where: {postId: post.id}}).then(comments => {
            comments.forEach(comment => {
                Users.findOne({where: {id: comment.userId}}).then(user => {
                    item = new Array(user.username, comment.body);
                    listComment.push(item);
                    res.render('detail', { title: slug, post: post, isLogin: isLogin, isUpdate: isUpdate, username: username, authorName: authorName, listComment: listComment });
                });
            })
        });
    });      
});
router.get('/:slug/update',isAuthorized, (req, res) => {
    let isLogin = true
    let slug = req.params.slug
    Posts.findOne({
        where: {slug: slug}
    }).then(post => {
        res.render('update', { title: 'Update', post: post, isLogin: isLogin});
    });
});
router.post('/:slug/update', (req, res) => {
    let slug = req.params.slug
    Posts.findOne({
        where: {slug: slug}
    }).then(post => {
        post.body = req.body.body;
        post.save();
        res.redirect('/blog/'+slug);
    });
});
router.get('/:slug/delete',isAuthorized , (req, res) => {
    let isLogin = true
    let slug = req.params.slug
    Posts.findOne({
        where: {slug: slug}
    }).then(post => {
        res.render('delete', { title: 'Delete', post: post, isLogin: isLogin })
    });
});
router.post('/:slug/delete', (req, res) => {
    let slug = req.params.slug
    Posts.findOne({
        where: {slug: slug}
    }).then(post => {
        post.destroy().then(()=>{
            res.redirect('/');
        });
    });
});
router.post('/:slug/comment', isAuthorized, (req, res) => {
    let slug = req.params.slug
    Posts.findOne({
        where: {slug: slug}
    }).then(post => {
        let item = {
            body: req.body.body,
            userId: req.session.user.id,
            postId: post.id
        };
        post.rating += 0.5;
        post.save();
        Comments.create(item).then(comment => {
            res.redirect(`/blog/${post.slug}`)
        });
    });
});
module.exports = router;