const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT;

// comment
router.post('/signup', async (req,res) => {
    try{
        const user = new User({
            userName: req.body.user ? req.body.user : 'Please enter a valid user name.',
            email: req.body.email,
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
        res.status(500).json({
            error:err.message
        })
    }
})

router.post('/login', async(req,res) => {
    try{
        const {userName, password} = req.body;
        const user = await User.findOne ({userName: userName});
        if(!userName) throw new Error ('Username or password does not match.');

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) throw new Error ('Username or password does not match.');
        const token = jwt.sign({id: newUser._id}, SECRET, {expiresIn: "1h"});
        res.status(200).json({
            user:user,
            message: 'Success! User logged in!',
            user, token
        })
    }catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
})
module.exports = router