const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  calories: { type: Number, required: true },
  proteins: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Goal', goalSchema);
