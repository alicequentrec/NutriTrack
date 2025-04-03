const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();


mongoose.connect('mongodb://localhost:27017/nutritrack')
  .then(() => console.log('MongoDB connecté !'))
  .catch(err => console.error('Erreur de connexion MongoDB :', err));


// Importation des routeurs pour les repas et les objectifs
const mealsRouter = require('./routes/meals');
const goalsRouter = require('./routes/goals');


// Middleware pour parser le JSON dans le corps des requêtes
app.use(bodyParser.json());

// Définition des routes de l'API
app.use('/meals', mealsRouter);
app.use('/goals', goalsRouter);

// Middleware de gestion des erreurs (optionnel)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Une erreur est survenue !' });
});

app.post('/meals', async (req, res, next) => {
    res.send('Hello World!')
    try {
    // Validation avec Joi
    //const { error } = mealSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    // Crée une nouvelle instance de Meal avec les données validées
    const newMeal = new Meal(req.body);
    const savedMeal = await newMeal.save();
    res.status(201).json(savedMeal);
  } catch (err) {
    next(err);
  }
});

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
  })

  // mettre à jour les routes 