require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT;

const DB = process.env.DB
const ProfileController = require('./controllers/ProfileController');

mongoose.connect(`${DB}/profiles`);

const db = mongoose.connection;
db.once("open", () => console.log(`Connected: ${DB}`))
app.use(express.json());

app.use('/profile', ProfileController);

app.listen(PORT, () => console.log(`Profiles: ${PORT}`));