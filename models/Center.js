const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    startTime: { type: String, required: true },  // Example: "09:00 AM"
    endTime: { type: String, required: true },    // Example: "11:00 AM" (2-hour slot)
    isAvailable: { type: Boolean, default: true } // Availability flag
});

const SportSchema = new mongoose.Schema({
    name: { type: String, required: true },       // Sport name (e.g., "badminton", "squash")
    courts: { type: Number, required: true },     // Number of courts/resources
    slots: [SlotSchema],                          // Array of 2-hour slots for the sport
    image: { type: String }                       // URL or path for sport-specific images
});

const CenterSchema = new mongoose.Schema({
    name: { type: String, required: true },       // Center name (e.g., "Indiranagar")
    location: { type: String, required: true },   // Center location
    image: { type: String },                      // URL or path for center image
    description: { type: String },                // Description of the center
    contact: {                                    // Contact details for the center
        phone: { type: String },
        email: { type: String }
    },
    sports: [SportSchema],                        // Array of sports offered at the center
    amenities: [String],                          // List of amenities (e.g., "Parking", "Changing Rooms")
    openHours: {                                  // Opening and closing hours for the center
        open: { type: String },                   // Example: "06:00 AM"
        close: { type: String }                   // Example: "10:00 PM"
    },
    ratings: {                                    // Center rating (optional)
        type: Number,
        min: 0,
        max: 5
    },
    createdAt: { type: Date, default: Date.now }, // Timestamp of creation
    updatedAt: { type: Date, default: Date.now }  // Timestamp of last update
});

// Define the mongoose model for a center
module.exports = mongoose.model('Center', CenterSchema);
