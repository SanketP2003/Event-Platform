const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'username _id');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const { title, description, date, location, capacity, image } = req.body;
  try {
    const newEvent = new Event({
      title, description, date, location, capacity, image,
      organizer: req.user.id
    });
    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/rsvp/:id', auth, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  try {
    const event = await Event.findOneAndUpdate(
      { 
        _id: eventId, 
        $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] },
        attendees: { $ne: userId }
      },
      { $push: { attendees: userId } },
      { new: true }
    );

    if (!event) {
      const checkEvent = await Event.findById(eventId);
      if (checkEvent && checkEvent.attendees.includes(userId)) {
        return res.status(400).json({ message: 'You have already joined this event' });
      }
      return res.status(400).json({ message: 'Event is full or unavailable' });
    }

    res.json({ message: 'RSVP Successful', event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/rsvp/:id', auth, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  try {
    const event = await Event.findByIdAndUpdate(
      eventId,
      { $pull: { attendees: userId } },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Left event successfully', event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my-events', auth, async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;