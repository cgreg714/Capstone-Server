const { Medication } = require ('../models/MedicationModel');
const { error } = require('../helpers/index');


//toDo test creating new med with timeOfDay and dayOfTheWeek(boolean values)
//*add medication
exports.postMedication = async(req,res) => {
    console.log(req.body);
    try {
        //pull data
         const {
              name, description, unitOfMeasurement, dose, frequency, quantity, dateAdded, prescriber
         } = req.body;
        //create new object
        const medication = new Medication({
            name, description, unitOfMeasurement, dose, frequency, quantity, dateAdded: new Date(), prescriber //id: req.user._id
        });
        //save object to db
        const newMed = await medication.save();
        //response
        res.status(200).json({
            message: `${newMed.name} added`,
            newMed
        })
    } catch (err) {
        // error(res,err);
        console.error(err.message);
    }
};
//* get all medication
exports.getMedication = async(req,res) => {
    console.log(req.body);
    try {
        const allMeds = await Medication.find();

        allMeds ?
        res.status(200).json({
            result: allMeds
        }):
        res.status(404).json({
            result:"No medications found"
        })
    } catch (err) {
        error(res,err);
    }
};
//*get by prescriber
exports.getByPrescriber = async(req,res) => {
    console.log(req.body);
    try {
        console.log('prescriber route');
        const { prescriber } = req.params;
        const medPrescriber = await Medication.find({prescriber: prescriber});
    
        if (medPrescriber.length === 0) throw new Error('No prescriber found');
    
        res.status(200).json({
            results: medPrescriber
        });
    } catch (err) {
        error(res,err);
    }
};
//*get by ID
exports.getByID = async(req,res) => {
    console.log(req.body);
    try {
        const { id } = req.params;
        const getMed = await Medication.findOne({_id: id});
        if(!getMed) throw new Error('no medication found');
        res.status(200).json({
            results: getMed
        })
    } catch (err) {
        error(res,err);
    }
};
//*get by medication name
// ////toDo Get by Medication Name -- spell check/auto complete
exports.getByName = async(req,res) => {
    console.log(req.body);
    try {
        const { name } =req.params;
        const medicationName = await Medication.find({name: name});
    
        if (medicationName.length === 0) throw new Error('No medication found by that name');
    
        res.status(200).json({
            results: medicationName
        });
    } catch (err) {
        error(res,err);
    }
};
//*patch/edit medication by ID
exports.patchByID = async(req,res) => {
    console.log(req.body);
    try {
        const filter = {
            _id: req.params.id
        };
        const info = req.body;
        const returnOption = {new: true};
        const updated = await Medication.findByIdAndUpdate(filter, info, returnOption);
        res.status(200).json({
            results:updated,
            message:"medication updated"
        });
    } catch (err) {
        error(res,err);
    }
};
//*delete one by ID
exports.deleteByID = async(req,res) => {
    console.log(req.body);
    try {
        const { id } = req.params;
        const deleteMed = await Medication.deleteOne({_id: id});
        console.log(deleteMed);
        deleteMed.deletedCount ?
        res.status(200).json({
            result: 'Medication Deleted'
        }):
        res.status(404).json({
            results:"No medication in collection"
        });
    } catch (err) {
        error(res,err);
    }
};

//*get medications by date added
exports.getByDate = async(req,res) => {
    console.log(req.body);
    try {
        const { dateAdded } =req.params;
        const getByDate = await Medication.find({dateAdded: dateAdded});

        if (getByDate.length === 0) throw new Error('No medication found');
        res.status(200).json({
            results: getByDate
        });
    } catch (err) {
        error(res,err);
    }
};

//*delete/clear all medications
exports.deleteAll = async(req,res) => {
    console.log(req);
    try {
        const deleteAll = await Medication.deleteMany();
        res.status(200).json({
            message: "All meds cleared"
        });
    } catch (err) {
        error(res,err);
    }
};

//*get by time of day
//toDo test
// exports.getByTimeOfDay = async(req,res) => {
//     console.log(req.body);
//     console.log('time of day route');
//     // console.log(req);
//     try {
//         const { timeOfDay } = req.params;
//         console.log(timeOfDay);
//         const medicationTimeOfDay = await Medication.find({timeOfDay: timeOfDay});
//         if (medicationTimeOfDay === false) throw new Error ('Medication Not Found');
//         res.status(200).json({
//             results: medicationTimeOfDay
//         }); 
//     } catch (err) {
//         error(res,err);
//     }
// };


exports.toggleField = async (req, res) => {
    try {
        const { profileId, medId, field } = req.params;

        const fieldParts = field.split('.');
        const mainField = fieldParts[0];
        const subField = fieldParts[1];

        const profile = await models.Profile.findById(profileId);

        // Find the correct medication
        const medication = profile.medications.find(med => med._id.toString() === medId);

        if (!medication) {
            throw new Error(`Medication with id ${medId} does not exist`);
        }

        // Check if the field exists before toggling
        if (medication.frequency[mainField] && medication.frequency[mainField][subField] !== undefined) {
            medication.frequency[mainField][subField] = !medication.frequency[mainField][subField];
            console.log(`Toggled ${mainField}.${subField} to ${medication.frequency[mainField][subField]}`);
        } else {
            throw new Error(`Field ${mainField}.${subField} does not exist`);
        }

        // Mark the medications array as modified
        profile.markModified('medications');

        await profile.save();
        console.log('Saved profile');

        helpers.success(res, medication);
    } catch (err) {
        helpers.error(res, err);
    }
};


//toDo test
//*get all by day of the week
exports.getByDayOfTheWeek = async(req,res) => {
    try {
        const { dayOfTheWeek } = req.params;
        console.log(req.dayOfTheWeek);
        const medicationDayOfTheWeek = await Medication.find({dayOfTheWeek: dayOfTheWeek});
        if (medicationDayOfTheWeek === undefined) throw new Error ('Medication Not Found');
        res.status(200).json({
            results: medicationDayOfTheWeek
        });
    } catch (err) {
        error(res,err);
    }
};