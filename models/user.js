var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    info: {
        firstname: String,
        lastname: String,
        phone: String,
        company: String, 
        address: String,
        location: String
        // cities: [{ type: Schema.ObjectId, ref: 'City'}], //store array city_id
        // countries: [{ type: Schema.ObjectId, ref: 'Country'}], //store array country_id
    },
    local: { // Use local
        email: String,
        password: String,
        activeToken: String,
        activeExpires: Date,
        resetPasswordToken: String,
        resetPasswordExpires: Date
    },
    courses: [{type: Schema.Types.ObjectId, ref: 'Course'}],
    role: String, // ADMIN, TEACHER, LEARNER
    status: String, // ACTIVE, INACTIVE, SUSPENDED.
    belongCourses: [{type: Schema.Types.ObjectId, ref: 'Course'}]
}, {
    timestamps: true
});

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}

// check role
userSchema.methods.isGroupAdmin = function(role){
    return role === 'ADMIN';
}

userSchema.methods.isInActivated = function(checkStatus){
    return checkStatus == "INACTIVE";
};

userSchema.methods.isSuspended = function(checkStatus){
    return checkStatus == "SUSPENDED";
};

module.exports = mongoose.model('Member', userSchema);