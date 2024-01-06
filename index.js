//Carlos' branch
//?Dependencies
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 4005; //process.env.PORT however my computer has trouble with this
//?Imports
const { db } = require('./db');
const medicationController = require('./controllers/medication.controller');

//?Middleware
app.use(express.static(`${__dirname}/public`)); // links to public/index.html file.
app.use(express.json()); // allows server to accept json as data to process.
app.use(express.urlencoded({extended: true})); // allows us to send data back to the browser.

//?Routes
app.use('/medication', medicationController);

//?Connection
const server = async () => {
    db();


    app.listen(PORT, () => console.log(`Server Running: ${PORT}`));
}

server();