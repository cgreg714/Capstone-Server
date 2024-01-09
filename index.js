require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');
const app = express();
const BACKEND_PORT = process.env.PORT;
const FRONTEND_PORT = process.env.FRONTEND_PORT;
const IP = process.env.IP;
const loginRoutes = require('./routes/LogoinRoutes');
const errorHandler = require('./middlewares/errorHandler');

mongoose
	.connect(process.env.MONGODB_URL)
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

app.use(errorHandler);

app.listen(BACKEND_PORT, () => {
	console.log(`Server is running on ${IP}:${BACKEND_PORT}`);
});