require('dotenv').config(); // connects our .env file to our project.

const express = require ('express');

const app = express();

const mongoose = require('mongoose');  // used from node_modules


const PORT = process.env.PORT; 
const MONGO = process.env.MONGODB;
console.log(MONGO)
const userController = require('./controllers/user.controller');
const aBuddyController = require('./controllers/aBuddy.controller');
mongoose.connect(`${MONGO}/Doseminder`);

const db = mongoose.connection; 

db.once("open", () => console.log(`Connected: ${MONGO}/users`)) //shows notification we are connected to the database

app.use(express.json());

app.use('/user', userController);
//app.use(validateSession); // all routes below require validation when used this way.
app.use('/aBuddy', aBuddyController);
app.listen(PORT, () => console.log(`Users: ${PORT}`)); //shows the server has started. first PORT is pointing to const PORT, second is pointing to the PORT in the .env file