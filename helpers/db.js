const mongoose = require('mongoose');
const MONGO = process.env.MONGODB_URL;
const DB_NAME = process.env.DB_NAME;

const db = async () => {
    try {
        await mongoose.connect(`${MONGO}/${DB_NAME}`, {
        });
    
        console.log(`Database connected to: ${MONGO}/${DB_NAME}`)
    } catch (err) {
        throw new Error(`Error: ${err.message}`);
    }

};

module.exports = {db, mongoose};
