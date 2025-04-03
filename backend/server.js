const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const Meal = require('./Models/Meal');
const Goal = require('./Models/Goal');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb://127.0.0.1:27017/nutritrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' Connexion MongoDB réussie !'))
.catch(err => console.error(' Erreur de connexion MongoDB:', err));

// Route GET 
app.get('/meals', async (req, res) => {
  try {
    const meals = await Meal.find();
    res.json(meals);
  } catch (err) {
    console.error('Erreur lors de la récupération des repas:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route POST 
app.post('/meals', async (req, res) => {
  try {
    const newMeal = new Meal(req.body);
    const savedMeal = await newMeal.save();
    res.status(201).json(savedMeal);
  } catch (err) {
    console.error('Erreur lors de la création du repas:', err);
    res.status(400).json({ error: err.message });
  }
});

// Route GET 
app.get('/goals', async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (err) {
    console.error('Erreur lors de la récupération des objectifs:', err);
    res.status(500).json({ error: err.message });
  }
});


app.post('/goals', async (req, res) => {
  try {
    const newGoal = new Goal(req.body);
    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    console.error('Erreur lors de la création des objectifs:', err);
    res.status(400).json({ error: err.message });
  }
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});