const router = require('express').Router();
const aBuddy = require('../models/aBuddy.model');
const jwt = require('jsonwebtoken');
const {error} = require('../helpers');
const SECRET = process.env.JWT;


router.post('/buddy', async (req,res) => {
    try{
        const myBuddy = new aBuddy({
            aBuddyFirstName: req.body.first ? req.body.first : 'Please enter a first name.',
            aBuddyLastName: req.body.last ? req.body.last : 'Please enter a last name.',
            aBuddyRelation: req.body.relation ? req.body.relation : 'Please enter your relationship to your buddy.',
            aBuddyEmail: req.body.email,
            aBuddyNumber: req.body.number ? req.body.number : 'Please enter a valid 10-digit phone number.',
            
        })
        const newBuddy = await myBuddy.save();
        const token = jwt.sign({id: newUser._id}, SECRET, {expiresIn: "1h"})
        res.status(200).json({
            myBuddy: newBuddy,
            message: 'Success! Accountabili-buddy added!',
            token
        })
    } catch (err) {
        error(req,res)
        }
    }
)


module.exports = router;