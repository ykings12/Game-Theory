const express = require('express');
const connectDB = require('./config');

const centerRoutes = require('./routes/center');
const bookingRoutes = require('./routes/booking');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(express.static('frontend'));

app.use('/api/center', centerRoutes);
app.use('/api/booking', bookingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
