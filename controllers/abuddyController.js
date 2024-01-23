const models = require('../models/databaseModel');
const {error} = require('../helpers/errorResponse');

exports.getAll = async (req, res) => {
    try {
        const buddies = await models.ABuddy.find({ profiles: { $in: [req.params.profileId] } });
        res.status(200).json(buddies);
    } catch (err) {
        error(res, err);
    }
};

exports.getOne = async (req, res) => {
    try {
        const buddy = await models.ABuddy.findOne({ _id: req.params.buddyId, profiles: { $in: [req.params.profileId] } });
        if (!buddy) {
            return res.status(404).json({ message: 'Buddy not found in this profile' });
        }
        res.status(200).json(buddy);
    } catch (err) {
        error(res, err);
    }
};

exports.create = async (req, res) => {
    try {
        const newBuddy = new models.ABuddy({ ...req.body, profiles: [req.params.profileId] });
        const savedBuddy = await newBuddy.save();

        // Find the profile and add the new buddy to it
        const profile = await models.Profile.findById(req.params.profileId);
        if (!profile) throw new Error('Profile not found');
        profile.abuddies.push(savedBuddy._id);
        await profile.save();

        res.status(200).json(savedBuddy);
    } catch (err) {
        error(res, err);
    }
};

exports.update = async (req, res) => {
    try {
        const updatedBuddy = await models.ABuddy.findOneAndUpdate({ _id: req.params.id, profile: req.params.profileId }, req.body, { new: true });
        if (!updatedBuddy) {
            return res.status(404).json({ message: 'Buddy not found' });
        }
        res.status(200).json(updatedBuddy);
    } catch (err) {
        error(res, err);
    }
};

exports.delete = async (req, res) => {
    try {
        const deletedBuddy = await models.ABuddy.findOneAndDelete({ _id: req.params.id, profile: req.params.profileId });
        if (!deletedBuddy) {
            return res.status(404).json({ message: 'Buddy not found' });
        }

        const profile = await models.Profile.findById(req.params.profileId);
        if (!profile) throw new Error('Profile not found');
        const buddyIndex = profile.abuddies.indexOf(req.params.id);
        if (buddyIndex !== -1) {
            profile.abuddies.splice(buddyIndex, 1);
            await profile.save();
        }

        res.status(200).json({ message: 'Buddy deleted' });
    } catch (err) {
        error(res, err);
    }
};