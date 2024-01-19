const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {error} = require('../helpers');
const SECRET = process.env.JWT;


router.post('/signup', async (req,res) => {
    try{
        const user = new User({
            userName: req.body.userName ? req.body.userName : 'Please enter a valid user name.',
            email: req.body.email ? req.body.email : 'Please enter a valid email address',
            password: bcrypt.hashSync(req.body.password, 13)
        })
        const newUser = await user.save();
        const token = jwt.sign({id: newUser._id}, SECRET, {expiresIn: "1h"})
        res.status(200).json({
            user: newUser,
            message: 'Success! DoseMinder account created!',
            token
        })
    } catch (err) {
        error(req,err)
        }
    }
)

router.post('/login', async(req,res) => {
    try{
        const {userName, password} = req.body;
        const user = await User.findOne ({userName: userName});
        if(!user) throw new Error ('Username or password does not match.');

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) throw new Error ('Username or password does not match.');
        const token = jwt.sign({id: user._id}, SECRET, {expiresIn: "1h"});
        res.status(200).json({
            user: user,
            message: 'Success! User logged in!',
            user, token
        })
    }catch (err) {
        error(req,err)
        }
    }
);
module.exports = router;