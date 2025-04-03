const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  proteins: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true }
});

// Vérifie si le modèle "Meal" existe déjà ; sinon, le crée.
module.exports = mongoose.models.Meal || mongoose.model('Meal', mealSchema);
