const fs = require('fs');
const Drug = require('../models/drugModel');

async function loadData() {
    try {
        const count = await Drug.countDocuments();
        if (count === 0) {
            for (let i = 1; i <= 1; i++) {
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
                        const interactions = drug.drug['drug-interactions']['drug-interaction'];
                        if (typeof interactions === 'object' && interactions !== null && !Array.isArray(interactions)) {
                            drugInteractions = Object.values(interactions).map(interaction => {
                                return {
                                    'drugbank-id': interaction['drugbank-id'],
                                    'name': interaction.name,
                                    'description': interaction.description
                                };
                            });
                        } else if (Array.isArray(interactions)) {
                            drugInteractions = interactions.map(interaction => {
                                return {
                                    'drugbank-id': interaction['drugbank-id'],
                                    'name': interaction.name,
                                    'description': interaction.description
                                };
                            });
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