const mongoose = require('mongoose');

const aBuddySchema = new mongoose.Schema({
    
    aBuddyFirstName: {
        type: String,
        required: true,
        unique: true, 
    },
    aBuddyLastName: {
        type: String,
        required: true,
        unique: true, 
    },
    aBuddyRelation: {
        type: String,
        required: true,
        unique: true,
    },
    aBuddyEmail: {
        type: String,
        required: true,
        unique: true,
    },
    aBuddyNumber: {
        type: String,
        required: true,
    }
});

const aBuddy = mongoose.model('aBuddy', aBuddySchema, 'aBuddy');

module.exports = aBuddy;