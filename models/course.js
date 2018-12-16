var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var courseSchema = new Schema({
    name: String,
    description: String,
    instructorId: {type: Schema.Types.ObjectId, ref: 'Member'},
    instructorName: String,
    image: String,
    documents: [{name: String, url: String}],
    learner: [{type: Schema.Types.ObjectId, ref: 'Member'}],
    session: Schema.Types.Mixed
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);