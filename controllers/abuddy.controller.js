const router = require('express').Router();
const aBuddy = require('../models/abuddy.model');
const jwt = require('jsonwebtoken');
const {error} = require('../helpers');
const SECRET = process.env.JWT;


router.post('/buddy', async (req,res) => {
    try{
        const myBuddy = new aBuddy({
            aBuddyFirstName: req.body.aBuddyFirstName ? req.body.aBuddyFirstName : 'Please enter a first name.',
            aBuddyLastName: req.body.aBuddyLastName ? req.body.aBuddyLastName : 'Please enter a last name.',
            aBuddyRelation: req.body.aBuddyRelation ? req.body.aBuddyRelation : 'Please enter your relationship to your buddy.',
            aBuddyEmail: req.body.aBuddyEmail,
            aBuddyNumber: req.body.aBuddyNumber ? req.body.aBuddyNumber : 'Please enter a valid 10-digit phone number.',
            
        })
        const newBuddy = await myBuddy.save();
        const token = jwt.sign({id: newBuddy._id}, SECRET, {expiresIn: "1h"})
        res.status(200).json({
            myBuddy: newBuddy,
            message: 'Success! Accountabili-buddy added!',
            token
        })
    } catch (err) {
        error(req,err)
        }
    }
)


module.exports = router;