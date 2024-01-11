const mongoose = require('mongoose');
const connection = process.env.DB;
const collection = process.env.COLL;

const db = async () => {
    try {
        await mongoose.connect(`${connection}/${collection}`, {
        });
    
        console.log(`Database connected to: ${connection}/${collection}`)
    } catch (err) {
        throw new Error(`Error: ${err.message}`);
    }

};

module.exports = {db, mongoose};