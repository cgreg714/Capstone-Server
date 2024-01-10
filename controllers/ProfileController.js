const router = require('express').Router();
const Profile = require('../models/ProfileModel');
const {error, success, incomplete} = require('../helpers');

// CREATE
router.post('/create', async(req,res) => {
    
    try {
        const {
            firstName, lastName, email, pharmacy, doctor, timezone
        } = req.body;
        if(!firstName) throw new Error('Please input a first name.');

        const profile = await new Profile({
            firstName, lastName, email, pharmacy, doctor, timezone
        }).save();

        profile ?
            success(res, profile) :
            incomplete(res);
    } catch (err) {
        error(res, err)
    }
});

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
        const {firstName,lastName,email,pharmacy,doctor,timezone} = req.body;

        const {profile} = req.params;

        const profileCheck = await Profile.find({_id: profile});

        if(!profileCheck) throw new Error('Profile not found.');

        const task = await Profile.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        )

        const newTask = await task.save();

        const forProfile = {
            id: newTask._id
        }

        await Profile.findOneAndUpdate(
            {_id: profile},
            {$push: {tasks: forProfile}}
        )
    } catch (err) {
        error(res, err)
    }
});

module.exports = router;