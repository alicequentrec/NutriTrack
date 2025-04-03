const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/nutritrack')
  .then(() => console.log('MongoDB connecté !'))
  .catch(err => console.error('Erreur de connexion MongoDB :', err));

// Middleware pour parser le JSON dans le corps des requêtes
app.use(bodyParser.json());

// ----- Routes pour les repas -----

// Route GET pour récupérer la liste des repas
app.get('/meals', (req, res) => {
  res.json({ message: 'Liste des repas' });
});

// Route POST pour créer un nouveau repas
app.post('/meals', async (req, res, next) => {
  try {

    // Ici, on simule la création d'un repas en renvoyant simplement les données reçues
    res.status(201).json(req.body);
  } catch (err) {
    next(err);
  }
});

// ----- Routes pour les objectifs -----

// Route GET pour récupérer la liste des objectifs
app.get('/goals', (req, res) => {
  res.json({ message: 'Liste des objectifs' });
});

// ----- exemple -----

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// ----- Middleware de gestion des erreurs -----

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Une erreur est survenue !' });
});

// ----- Démarrage du serveur -----

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

  // mettre à jour les routes 
  // avoir un formulaire avec mes menues des que j'en envoie