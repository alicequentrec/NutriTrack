// frontend/app.js

// Fonctions de composition
const compose = (...fns) => (x) =>
    fns.reduceRight((acc, fn) => fn(acc), x);
  const pipe = (...fns) => (x) =>
    fns.reduce((acc, fn) => fn(acc), x);
  
  // Exemple de fonction pure pour transformer les données du formulaire en objet meal
  const formDataToMeal = (formData) => {
    const meal = Object.fromEntries(formData.entries());
    return {
      ...meal,
      calories: Number(meal.calories),
      proteins: Number(meal.proteins),
      carbs: Number(meal.carbs),
      fats: Number(meal.fats)
    };
  };
  
  // Gestionnaire d'événement pour le formulaire
  document.getElementById('meal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Transformation fonctionnelle des données
    const meal = pipe(formDataToMeal)(formData);
    
    // Envoi du repas au backend
    try {
      const response = await fetch('http://localhost:3000/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meal)
      });
      const data = await response.json();
      console.log('Repas ajouté :', data);
      // Ici, vous pouvez mettre à jour le dashboard, recharger les données, etc.
    } catch (error) {
      console.error('Erreur lors de l\'ajout du repas :', error);
    }
  });
  