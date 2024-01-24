const models = require('../models/databaseModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { error, success } = require('../helpers/response');
const SECRET = process.env.JWT;

exports.signup = async (req,res) => {
    try{
        const user = new models.User({
            userName: req.body.userName ? req.body.userName : 'Please enter a valid user name.',
            email: req.body.email ? req.body.email : 'Please enter a valid email address',
            password: bcrypt.hashSync(req.body.password, 13)
        })
        const newUser = await user.save();
        const token = jwt.sign({id: newUser._id}, SECRET, {expiresIn: "1h"})
        success(res, {
            user: newUser,
            message: 'Success! DoseMinder account created!',
            token
        });
    } catch (err) {
        error(res, err);
    }
}

exports.login = async(req,res) => {
    try{
        const {userName, password} = req.body;
        const user = await models.User.findOne ({userName: userName});
        if(!user) throw new Error ('Username or password does not match.');

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) throw new Error ('Username or password does not match.');
        const token = jwt.sign({id: user._id}, SECRET, {expiresIn: "1h"});
        success(res, {
            user: user,
            message: 'Success! User logged in!',
            user, token
        });
    }catch (err) {
        error(res, err);
    }
};