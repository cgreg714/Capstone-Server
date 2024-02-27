const Joi = require('joi');
const mongoose = require('mongoose');
const zxcvbn = require('zxcvbn');
const bcrypt = require('bcrypt');

const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
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
    resetPasswordExpires: { type: Date, expires: 0 },
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

        const passwordStrength = zxcvbn(this.password);
        if (passwordStrength.score < 3) {
            throw new Error('Password is too weak');
        }

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