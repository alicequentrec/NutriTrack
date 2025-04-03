
/**
 * Calcule les totaux nutritionnels à partir d'un tableau de repas.
 * Chaque repas doit contenir les propriétés: calories, proteins, carbs, fats.
 *
 * @param {Array} meals -
 * @returns {Object} 
 */
const calculateDailyTotals = (meals) =>
    meals.reduce((totals, meal) => ({
      calories: totals.calories + meal.calories,
      proteins: totals.proteins + meal.proteins,
      carbs: totals.carbs + meal.carbs,
      fats: totals.fats + meal.fats,
    }), { calories: 0, proteins: 0, carbs: 0, fats: 0 });
  
  module.exports = { calculateDailyTotals };
  