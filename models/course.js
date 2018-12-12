var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var courseSchema = new Schema({
    name: String,
    description: String,
    instructorId: Object,
    instructorName: String,
    image: String,
    documents: [{name: String, url: String}],
    learner: []
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);