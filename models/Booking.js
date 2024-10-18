const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    centerId: {type: String, ref: 'Center', required: true }, // Reference to the center
    userEmail: { type: String, required: true },  // Email of the user
    date: { type: Date, required: true },         // Date of the booking
    sport: { type: String, required: true },      // Name of the sport
    slot: { type: String, required: true },       // Selected time slot (e.g., "06:00 AM - 08:00 AM")
    createdAt: { type: Date, default: Date.now }, // Timestamp of when the booking was created
    updatedAt: { type: Date, default: Date.now }, // Timestamp of last update
    status: { 
        type: String, 
        enum: ['confirmed', 'cancelled', 'completed'], 
        default: 'confirmed' 
    }, // Status of the booking
});

// Define the mongoose model for a booking
module.exports = mongoose.model('Booking', BookingSchema);
