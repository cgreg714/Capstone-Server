const fs = require('fs');
const Drug = require('../models/DrugModel');

async function loadData() {
    try {
        const count = await Drug.countDocuments();
        if (count === 0) {
            const data = fs.readFileSync('./drugDB/twoDrugs.json', 'utf8');
            const jsonData = JSON.parse(data);
            const drugs = Object.values(jsonData.drug);
            await Drug.insertMany(drugs);
            console.log('Data loaded successfully');
        } else {
            console.log('Data already exists, not loading data');
        }
    } catch (error) {
        console.error('Failed to load data', error);
    }
}

module.exports = loadData;