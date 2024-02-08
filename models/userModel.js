const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{3,30}$')),
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
    profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }]
});

const validateUser = (user) => {
    const { error } = schema.validate(user);
    if (error) {
        throw new Error(error.details[0].message);
    }
};

UserSchema.pre('save', async function (next) {
    const user = {
        username: this.username,
        email: this.email,
    };

    if (this.isModified('password')) {
        if (!this.password) {
            throw new Error('Password is required');
        }

        user.password = this.password;
        this.password = await bcrypt.hash(this.password, 10);
    }

    validateUser(user);
    next();
});

UserSchema.methods.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;