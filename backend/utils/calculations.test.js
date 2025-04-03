const { calculateDailyTotals } = require('./calculations');

test('calcule correctement les totaux nutritionnels', () => {
  const meals = [
    { calories: 500, proteins: 20, carbs: 50, fats: 10 },
    { calories: 300, proteins: 15, carbs: 30, fats: 5 },
  ];
  const totals = calculateDailyTotals(meals);
  expect(totals).toEqual({ calories: 800, proteins: 35, carbs: 80, fats: 15 });
});