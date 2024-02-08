const fs = require('fs');
const Drug = require('../models/drugModel');

async function loadData() {
    try {
        const count = await Drug.countDocuments();
        if (count === 0) {
            const data = fs.readFileSync('./drugDB/twoDrugs.json', 'utf8');
            const jsonData = JSON.parse(data);
            const drugs = Object.values(jsonData.drug).map(drug => ({
                ...drug,
                'drug-interactions': Object.values(drug['drug-interactions']['drug-interaction']),
                'food-interactions': [drug['food-interactions']],
                'products': Object.values(drug['products']['product']),
            }));
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