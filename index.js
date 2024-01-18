require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');
const app = express();

const MONGO = process.env.MONGODB_URL;
const BACKEND_PORT = process.env.PORT;
const FRONTEND_PORT = process.env.FRONTEND_PORT;
const IP = process.env.IP;

const {db} = require('./db')

const ProfileController = require('./controllers/ProfileController');
const loginRoutes = require('./routes/LogoinRoutes');
const errorHandler = require('./middlewares/errorHandler');
const userController = require('./controllers/user.controller');
const aBuddyController = require('./controllers/aBuddy.controller');

const db = mongoose.connection; 
db.once("open", () => console.log(`Connected: ${MONGO}/users`)) //shows notification we are connected to the database

mongoose
	.connect(`${MONGO}/DoseMinder`)
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.error(err));

// app.use(
// 	cors({
// 		origin: `${IP}:${FRONTEND_PORT}`,
// 		credentials: true,
// 	})
// );

app.use(express.json());

app.use('/', loginRoutes);
app.use('/profile', ProfileController);

app.use('/user', userController);
//app.use(validateSession); // all routes below require validation when used this way.
app.use('/myBuddy', aBuddyController);

app.use(errorHandler);

app.listen(BACKEND_PORT, () => {
	console.log(`Server is running on ${IP}:${BACKEND_PORT}`);
});