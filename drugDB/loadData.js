const fs = require('fs');
const Drug = require('../models/drugModel');

async function loadData() {
    try {
        const count = await Drug.countDocuments();
        if (count === 0) {
            for (let i = 1; i <= 11; i++) {
                const data = fs.readFileSync(`./drugDB/AllTheDrugs_${i}.json`, 'utf8');
                const jsonData = JSON.parse(data);
                const drugs = jsonData.map(drug => {
                    let products = [];
                    if (drug.drug['products'] && drug.drug['products']['product']) {
                        if (typeof drug.drug['products']['product'] === 'string') {
                            products = [{ name: drug.drug['products']['product'] }];
                        } else if (Array.isArray(drug.drug['products']['product'])) {
                            products = drug.drug['products']['product'].map(product => {
                                if (product) {
                                    return {
                                        name: product.name,
                                        labeller: product.labeller,
                                        'dosage-form': product['dosage-form'],
                                        strength: product.strength,
                                        route: product.route,
                                        country: product.country
                                    };
                                }
                                return null;
                            }).filter(product => product !== null);
                        }
                    }
                    let drugInteractions = [];
                    if (drug.drug['drug-interactions'] && drug.drug['drug-interactions']['drug-interaction']) {
                        if (typeof drug.drug['drug-interactions']['drug-interaction'] === 'string') {
                            drugInteractions = [{ 'drug-interaction': drug.drug['drug-interactions']['drug-interaction'] }];
                        } else if (Array.isArray(drug.drug['drug-interactions']['drug-interaction'])) {
                            drugInteractions = drug.drug['drug-interactions']['drug-interaction'].map(interaction => ({ 'drug-interaction': interaction }));
                        }
                    }
                    let foodInteractions = [];
                    if (drug.drug['food-interactions']) {
                        if (typeof drug.drug['food-interactions'] === 'string') {
                            foodInteractions = [{ 'food-interaction': drug.drug['food-interactions'] }];
                        } else if (Array.isArray(drug.drug['food-interactions'])) {
                            foodInteractions = drug.drug['food-interactions'].map(interaction => ({ 'food-interaction': interaction }));
                        }
                    }
                    return {
                        ...drug.drug,
                        'drug-interactions': drugInteractions,
                        'food-interactions': foodInteractions,
                        'products': products,
                    };
                });
                await Drug.insertMany(drugs);
                console.log(`Data from AllTheDrugs_${i} loaded successfully`);
            }
        } else {
            console.log('Data already exists, not loading data');
        }
    } catch (error) {
        console.error('Failed to load data', error);
    }
}

module.exports = loadData;