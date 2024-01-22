const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = Joi.object({
    username: Joi.string().alphanum().min(8).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    email: Joi.string().email().required(),
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
        type: String,
        enum: ['admin', 'sponsor', 'user'],
        default: 'user'
    },
    avatar: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

UserSchema.methods.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;