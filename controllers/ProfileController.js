const router = require('express').Router();
const Profile = require('../models/ProfileModel');
const {error, success, incomplete} = require('../helpers');

// CREATE
router.post('/create', async(req,res) => {
    try {
        const {
            firstName, lastName, email, pharmacy, doctor, timezone
        } = req.body

        const profile = new Profile({
            firstName, lastName, email, pharmacy, doctor, timezone
        });

        const newProfile = await profile.save()

        res.status(200).json({
            message: `${newProfile.firstName}'s profile created!`
        })
    } catch (err) {
        error(res, err)
    }
})

// GET All Profiles
router.get('/',async(req,res) => {
    try {
        const allProfiles = await Profile.find();

        allProfiles ?
            success(res, allProfiles) :
            incomplete(res);
    } catch (err) {
        error(res, err)
    }
});

// GET One Profile, awaiting validateSession
router.get('/:id', async(req,res) => {
    try {
        const {id} = req.params;
        const getProfile = await Profile.findOne({_id: id});

        if (!getProfile) throw new Error('No profile found');

        getProfile ?
            success(res,getProfile) :
            incomplete(res);
    } catch (error) {
        error(res, err)
    }
});

// Patch Profile Information, awaiting validateSession
router.patch('/:id', async(req,res) => {
    try {
    
    } catch (err) {
        error(res, err)
    }
});

module.exports = router;