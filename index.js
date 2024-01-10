require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;

const {db} = require('./db')
const ProfileController = require('./controllers/ProfileController');

app.use(express.json());

app.use('/profile', ProfileController);

const server = async () => {
    db();
    
    app.listen(PORT, () => console.log(`Server Running: ${PORT}`));
}

server();