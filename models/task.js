'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  time: { type: Number, default: 0 },
  columnId: { type: mongoose.Schema.Types.ObjectId, ref: 'Column' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Add `createdAt` and `updatedAt` fields
schema.set('timestamps', true);

// Transform output during `res.json(data)`, `console.log(data)` etc.
schema.set('toObject', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

module.exports = mongoose.model('Task', schema);