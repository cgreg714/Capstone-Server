const models = require('../models/databaseModel');
const { error, success, incomplete } = require('../helpers/response');

exports.createABuddy = async (req, res) => {
    try {
        const profile = await models.Profile.findById(req.params.profileId);
        if (!profile) throw new Error('Profile not found');

        const newBuddy = { ...req.body };
        const buddyDoc = profile.abuddies.create(newBuddy);
        profile.abuddies.push(buddyDoc);
        await profile.save();

        success(res, buddyDoc);
    } catch (err) {
        error(res, err);
    }
};

exports.getAllABuddies = async (req, res) => {
    try {
        const profile = await models.Profile.findById(req.params.profileId);
        if (!profile) throw new Error('Profile not found');

        success(res, profile.abuddies);
    } catch (err) {
        error(res, err);
    }
};

exports.getOneABuddy = async (req, res) => {
    console.log("🚀 ~ file: abuddyController.js:32 ~ exports.getOneABuddy= ~ req:", req.params)
    try {
        const profile = await models.Profile.findById(req.params.profileId);
        if (!profile) throw new Error('Profile not found');

        const buddy = profile.abuddies.id(req.params.aBuddyId);
        if (!buddy) {
            return incomplete(res, 'Buddy not found');
        }

        success(res, buddy);
    } catch (err) {
        error(res, err);
    }
};

exports.updateABuddy = async (req, res) => {
    try {
        const profile = await models.Profile.findById(req.params.profileId);
        if (!profile) throw new Error('Profile not found');

        const buddy = profile.abuddies.id(req.params.aBuddyId);
        if (!buddy) {
            return incomplete(res, 'Buddy not found');
        }

        buddy.set(req.body);
        await profile.save();

        success(res, buddy);
    } catch (err) {
        error(res, err);
    }
};

exports.deleteABuddy = async (req, res) => {
    try {
        const profile = await models.Profile.findById(req.params.profileId);
        if (!profile) throw new Error('Profile not found');

        const buddy = profile.abuddies.id(req.params.aBuddyId);
        if (!buddy) {
            return incomplete(res, 'Buddy not found');
        }

        profile.abuddies.pull(buddy);
        await profile.save();

        success(res, { message: 'Buddy deleted' });
    } catch (err) {
        error(res, err);
    }
};