const express = require('express');
const Center = require('../models/Center');
const router = express.Router();

router.post('/update', async (req, res) => {
    const { name, sportName, startTime, endTime } = req.body;

    try {
        // Find the center by name
        const center = await Center.findOne({ name });

        if (!center) {
            return res.status(404).json({ msg: 'Center not found' });
        }

        // Find the specific sport by name
        const sport = center.sports.find(sport => sport.name === sportName);
        if (!sport) {
            return res.status(404).json({ msg: 'Sport not found at this center' });
        }

        // Find the specific slot by startTime and endTime
        const slot = sport.slots.find(slot => slot.startTime === startTime && slot.endTime === endTime);
        if (!slot) {
            return res.status(404).json({ msg: 'Slot not found' });
        }

        // Update the availability of the slot
        slot.isAvailable = false;

        // Save the updated center document
        await center.save();

        res.json({ msg: 'Slot updated successfully', center });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Get all centers
router.get('/all', async (req, res) => {
    try {
        const centers = await Center.find();
        res.json(centers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



// Get a specific center by name
router.get('/name/:name', async (req, res) => {
    try {
        const center = await Center.findOne({ name: req.params.name });
        if (!center) {
            return res.status(404).json({ msg: 'Center not found' });
        }
        res.json(center);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
