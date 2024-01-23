const mongoose = require('mongoose');

const aBuddySchema = new mongoose.Schema({
    
    firstName: {
        type: String,
        required: true,
        unique: true, 
    },
    lastName: {
        type: String,
        required: true,
        unique: true, 
    },
    relation: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    }
});

aBuddySchema.index({ firstName: 1, lastName: 1, email: 1}, { unique: true });

const aBuddy = mongoose.model('aBuddy', aBuddySchema, 'aBuddy');

module.exports = aBuddy;