const sequelize = require('./db');
const Sequelize = require('sequelize')
var bcrypt = require('bcrypt');
const PostSchema = require('./Posts');
const CommentSchema = require('./Comments');

//define User table in MySQL
const UserSchema = sequelize.define('user', {
    id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    username: {type: Sequelize.STRING, allowNull: false, unique: true},
    email: {type: Sequelize.STRING, allowNull: false, unique: true},
    password: {type: Sequelize.STRING, allowNull: false}
},{
    hooks: {
        //before create user we will encrypt password
        beforeCreate: (user, options) => {
            return bcrypt.hash(user.password, 10).then(hash => {
                //change encoded password
                user.password = hash
            })    
        }
    }
})
UserSchema.prototype.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
}
UserSchema.hasMany(PostSchema, {as: 'Posts'});
UserSchema.hasMany(CommentSchema, {as: 'Comments'});
//create table if it doesn't exist
sequelize.sync();
module.exports = UserSchema;