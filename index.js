require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Configuration
const BACKEND_PORT = process.env.PORT;
const IP = process.env.IP;
const FPORT = process.env.FPORT;
const { MONGODB, DB_NAME } = process.env;

// Data loading
const loadData = require('./drugDB/loadData');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const drugRoutes = require('./routes/drugRoutes');
const aBuddyRoutes = require('./routes/aBuddyRoutes');

// Middlewares
const errorHandler = require('./middlewares/errorHandler');

// Database connection
const db = require('./helpers/db');

db()
    .then(() => {
        console.log(`Database connected to: ${MONGODB}/${DB_NAME}`);
        loadData();
    })
    .catch((err) => console.error(err));

// CORS
app.use(
	cors({
		origin: `${IP}:${FPORT}`,
		credentials: true,
	})
);

// Middleware setup
app.use(express.json());

// Route setup
app.use('/', authRoutes);
app.use('/user', userRoutes);
app.use('/user', profileRoutes);
app.use('/user', medicationRoutes);
app.use('/user', aBuddyRoutes);
app.use('/drugs', drugRoutes);

// Error handling
app.use(errorHandler);

// Server setup
app.listen(BACKEND_PORT, () => {
    console.log(`Server is running on ${IP}:${BACKEND_PORT}`);
});