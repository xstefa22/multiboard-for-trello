const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    apiKey: { type: String, required: true },
    token: { type: String, required: true },
});

UserSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, (error, salt) => {
        if (error) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, (error, hash) => {
            if (error) {
                return next(err);
            }

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.isCorrectPassword = function (password, callback) {
    bcrypt.compare(password, this.password, (error, same) => {
        if (error) {
            callback(error);
        } else {
            callback(error, same);
        }
    });
};

module.exports = mongoose.model('User', UserSchema);
