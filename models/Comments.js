const sequelize = require('./db');
const Sequelize = require('sequelize');

//define Post table in MySQL
const CommentSchema = sequelize.define('comment', {
    id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    body: {type: Sequelize.STRING},
    date: {type: Sequelize.DATE, defaultValue: Sequelize.NOW}
}, {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false
});
//create table if it doesn't exist
sequelize.sync();
module.exports = CommentSchema;