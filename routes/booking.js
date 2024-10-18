const express = require('express');
const Booking = require('../models/Booking');

const router = express.Router();

// Create a booking
router.post('/create', async (req, res) => {
    try {
        // console.log(req.body)
        const { centerId, userEmail, date, sport, slot } = req.body;

        // Validate required fields
        if (!centerId ||  !userEmail ||  !date || !sport || !slot) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Create a new booking
        const newBooking = new Booking({
            centerId, // Ensure ObjectId is valid
            userEmail,
            date: new Date(date), // Convert to Date object
            sport,
            slot
        });

        // Save the booking to the database
        await newBooking.save();

        // Return the new booking as a response
        res.status(201).json({ booking: newBooking, message: 'Booking created successfully.' });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'An error occurred while creating the booking.' });
    }
});


// Get all bookings for a center
router.get('/center/:centerId', async (req, res) => {
    try {
        const bookings = await Booking.find({ center: req.params.centerId });
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
