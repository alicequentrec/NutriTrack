const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  calories: { type: Number, required: true },
  proteins: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true }
});

// Utilise "Goal" comme nom de modèle et vérifie s'il est déjà défini.
module.exports = mongoose.models.Goal || mongoose.model('Goal', goalSchema);
