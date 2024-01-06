const mongoose = require('mongoose');
const connection = process.env.DBURL;
const collection = process.env.COLL;

const db = async () => {

    try {
        
            await  mongoose.connect(`${connection}/${collection}`);
        
            console.log(`Database connected to: ${connection}/${collection}`);
        
    } catch (error) {
        throw new Error(`Error: ${err.message}`);
    }
}

module.exports = {db, mongoose}