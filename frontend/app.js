function showSection(sectionId) {
  // Cache toutes les sections
  document.querySelectorAll('section').forEach(section => section.classList.remove('active'));
  // Affiche la section sélectionnée
  document.getElementById(sectionId).classList.add('active');

  // Met à jour le contenu en fonction de la section affichée
  if (sectionId === 'dashboard') {
    updateDashboard();
    renderMealList();
  }
  if (sectionId === 'stats') updateStatistics();
}


// OBJECTIFS (CALORIES, PROTÉINES, ETC.)

function getObjectives() {
  // Retourne un objet par défaut si rien n'est stocké
  const stored = localStorage.getItem('objectives');
  if (!stored) {
    return {
      dailyCalories: 2000,
      dailyProteins: 150,
      dailyCarbs: 300,
      dailyFats: 70
    };
  }
  return JSON.parse(stored);
}

function setObjectives(objectives) {
  localStorage.setItem('objectives', JSON.stringify(objectives));
}


// RECUPÉRATION ET STOCKAGE DES REPAS

async function getMeals() {
  try {
    const response = await fetch('http://localhost:3000/meals');
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des repas');
    }
    const meals = await response.json();
    return meals;
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
}

async function addMeal(meal) {
  try {
    const response = await fetch('http://localhost:3000/meals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meal)
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout du repas');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    return null;
  }
}


// CALCUL DES TOTAUX

function calculateTotals(meals) {
  return meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    proteins: acc.proteins + meal.proteins,
    carbs: acc.carbs + meal.carbs,
    fats: acc.fats + meal.fats
  }), { calories: 0, proteins: 0, carbs: 0, fats: 0 });
}


// DASHBOARD 
async function updateDashboard() {
  const objectives = getObjectives();
  const meals = await getMeals();
  const totals = calculateTotals(meals);

  // Mise à jour des objectifs affichés
  document.getElementById('calories-goal').textContent = objectives.dailyCalories;
  document.getElementById('proteins-goal').textContent = objectives.dailyProteins;
  document.getElementById('carbs-goal').textContent = objectives.dailyCarbs;
  document.getElementById('fats-goal').textContent = objectives.dailyFats;

  // Mise à jour des compteurs
  document.getElementById('calories-count').textContent = totals.calories;
  document.getElementById('proteins-count').textContent = totals.proteins;
  document.getElementById('carbs-count').textContent = totals.carbs;
  document.getElementById('fats-count').textContent = totals.fats;

  // Mise à jour des barres de progression (max 100%)
  const calPercent = Math.min(totals.calories / objectives.dailyCalories * 100, 100);
  document.getElementById('calories-progress').style.width = calPercent + '%';

  const protPercent = Math.min(totals.proteins / objectives.dailyProteins * 100, 100);
  document.getElementById('proteins-progress').style.width = protPercent + '%';

  const carbsPercent = Math.min(totals.carbs / objectives.dailyCarbs * 100, 100);
  document.getElementById('carbs-progress').style.width = carbsPercent + '%';

  const fatsPercent = Math.min(totals.fats / objectives.dailyFats * 100, 100);
  document.getElementById('fats-progress').style.width = fatsPercent + '%';
}


async function renderMealList() {
  const meals = await getMeals();
  const tbody = document.querySelector('#meal-list tbody');
  tbody.innerHTML = ''; 

  meals.forEach(meal => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${meal.name}</td>
      <td>${meal.calories}</td>
      <td>${meal.proteins}</td>
      <td>${meal.carbs}</td>
      <td>${meal.fats}</td>
    `;
    tbody.appendChild(row);
  });
}


function getRecommendation(totals, objectives) {
  let recommendation = "";
  if (totals.calories < objectives.dailyCalories) {
    recommendation += `Il vous manque ${objectives.dailyCalories - totals.calories} calories pour atteindre votre objectif. `;
  } else {
    recommendation += "Vous avez atteint (ou dépassé) votre objectif calorique ! ";
  }
 
  return recommendation;
}

function getTopMeal(meals) {
  if (!meals.length) return { name: "N/A", calories: 0 };
  return meals.reduce((prev, current) => (prev.calories > current.calories ? prev : current));
}

function getBalancedMeals(meals) {

  return meals.filter(m => m.proteins >= 10 && m.carbs >= 20 && m.fats >= 5);
}

function updateStatistics() {
  const meals = getMeals();
  const objectives = getObjectives();
  if (meals.length === 0) {
    document.getElementById('recommendation-text').textContent = "Aucun repas ajouté.";
    document.getElementById('top-meal').textContent = "Top repas le plus riche : N/A";
    document.getElementById('balanced-meals').textContent = "Repas équilibrés : N/A";
    return;
  }

  const totals = calculateTotals(meals);
  const recommendation = getRecommendation(totals, objectives);
  document.getElementById('recommendation-text').textContent = recommendation;

  const topMeal = getTopMeal(meals);
  document.getElementById('top-meal').textContent = `Top repas le plus riche : ${topMeal.name} (${topMeal.calories} calories)`;

  const balancedMeals = getBalancedMeals(meals);
  document.getElementById('balanced-meals').textContent = `Repas équilibrés : ${balancedMeals.length}`;
}


document.getElementById('meal-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const newMeal = {
    name: document.getElementById('meal-name').value,
    calories: Number(document.getElementById('calories').value),
    proteins: Number(document.getElementById('proteins').value),
    carbs: Number(document.getElementById('carbs').value),
    fats: Number(document.getElementById('fats').value)
  };

  await addMeal(newMeal);
  e.target.reset();
  await updateDashboard();
  await renderMealList();
  showSection('dashboard');
});


document.getElementById('objectives-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const newObjectives = {
    dailyCalories: Number(document.getElementById('daily-calories').value),
    dailyProteins: Number(document.getElementById('daily-proteins').value),
    dailyCarbs: Number(document.getElementById('daily-carbs').value),
    dailyFats: Number(document.getElementById('daily-fats').value)
  };
  setObjectives(newObjectives);
  // Met à jour le Dashboard pour refléter les nouveaux objectifs
  updateDashboard();
  alert('Objectifs mis à jour !');
  showSection('dashboard');
});


window.addEventListener('DOMContentLoaded', async () => {
  // Pré-remplissage du formulaire d'objectifs avec les valeurs stockées
  const objectives = getObjectives();
  document.getElementById('daily-calories').value = objectives.dailyCalories;
  document.getElementById('daily-proteins').value = objectives.dailyProteins;
  document.getElementById('daily-carbs').value = objectives.dailyCarbs;
  document.getElementById('daily-fats').value = objectives.dailyFats;

  await updateDashboard();
  await renderMealList();
});
