const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  date:        { type: Date, required: true },
  location:    { type: String, required: true },
  capacity:    { type: Number, required: true },
  category:    { type: String, default: 'General' },
  image:       { type: String },
  organizer:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attendees:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Event', EventSchema);