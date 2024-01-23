const aBuddy = require('../models/abuddyModel');
const {error} = require('../helpers/errorResponse');

exports.getAll = async (req, res) => {
    try {
        const buddies = await aBuddy.find();
        res.status(200).json(buddies);
    } catch (err) {
        error(res, err);
    }
};

exports.getOne = async (req, res) => {
    try {
        const buddy = await aBuddy.findById(req.params.id);
        if (!buddy) {
            return res.status(404).json({ message: 'Buddy not found' });
        }
        res.status(200).json(buddy);
    } catch (err) {
        error(res, err);
    }
};

exports.create = async (req, res) => {
    try {
        const newBuddy = new aBuddy(req.body);
        const savedBuddy = await newBuddy.save();
        res.status(200).json(savedBuddy);
    } catch (err) {
        error(res, err);
    }
};

exports.update = async (req, res) => {
    try {
        const updatedBuddy = await aBuddy.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
        const deletedBuddy = await aBuddy.findByIdAndDelete(req.params.id);
        if (!deletedBuddy) {
            return res.status(404).json({ message: 'Buddy not found' });
        }
        res.status(200).json({ message: 'Buddy deleted' });
    } catch (err) {
        error(res, err);
    }
};