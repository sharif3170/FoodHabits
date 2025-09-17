import React, { useState } from 'react';
import { FoodHabitData } from '../types/FoodHabit';
import { Calendar, Plus, Trash2 } from 'lucide-react';

interface MealPlannerProps {
  data: FoodHabitData;
  updateData: (newData: Partial<FoodHabitData>) => void;
  user: { id: string } | null;
}

export const MealPlanner: React.FC<MealPlannerProps> = ({ data, updateData, user }) => {
  const apiBase = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  const weekStartStr = weekStart.toISOString().slice(0,10);
  const [selectedDay, setSelectedDay] = useState<keyof typeof data.mealPlan>('monday');
  const [newMeal, setNewMeal] = useState('');

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ] as const;

  const addMeal = async () => {
    if (!newMeal.trim()) return;
    
    const updatedMealPlan = {
      ...data.mealPlan,
      [selectedDay]: [...data.mealPlan[selectedDay], newMeal.trim()]
    };
    
    updateData({ mealPlan: updatedMealPlan });
    if (user) {
      await fetch(`${apiBase}/api/meal-plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, weekStart: weekStartStr, days: updatedMealPlan })
      });
    }
    setNewMeal('');
  };

  const removeMeal = async (mealIndex: number) => {
    const updatedMeals = data.mealPlan[selectedDay].filter((_, index) => index !== mealIndex);
    const updatedMealPlan = {
      ...data.mealPlan,
      [selectedDay]: updatedMeals
    };
    
    updateData({ mealPlan: updatedMealPlan });
    if (user) {
      await fetch(`${apiBase}/api/meal-plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, weekStart: weekStartStr, days: updatedMealPlan })
      });
    }
  };

  const mealSuggestions = [
    'Oatmeal with berries',
    'Greek yogurt with nuts',
    'Grilled chicken salad',
    'Quinoa bowl with vegetables',
    'Salmon with sweet potato',
    'Smoothie bowl',
    'Avocado toast',
    'Vegetable stir-fry',
    'Lean protein with brown rice',
    'Mediterranean wrap'
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Meal Planner</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-5 w-5" />
          <span>Plan your weekly meals</span>
        </div>
      </div>

      {/* Day Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Day</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {days.map((day) => (
            <button
              key={day.key}
              onClick={() => setSelectedDay(day.key)}
              className={`p-3 rounded-lg font-medium transition-all duration-200 ${
                selectedDay === day.key
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add Meal Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Add Meal for {days.find(d => d.key === selectedDay)?.label}
        </h3>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMeal}
            onChange={(e) => setNewMeal(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addMeal()}
            placeholder="Enter meal or recipe name..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <button
            onClick={addMeal}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add</span>
          </button>
        </div>

        {/* Meal Suggestions */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {mealSuggestions.slice(0, 6).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setNewMeal(suggestion)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-green-100 hover:text-green-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Day Meals */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {days.find(d => d.key === selectedDay)?.label} Meals
          </h3>
          {data.mealPlan[selectedDay].length > 0 ? (
            <div className="space-y-3">
              {data.mealPlan[selectedDay].map((meal, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-800">{meal}</span>
                  <button
                    onClick={() => removeMeal(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No meals planned for this day</p>
          )}
        </div>

        {/* Week Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Week Summary</h3>
          <div className="space-y-4">
            {days.map((day) => {
              const mealsCount = data.mealPlan[day.key].length;
              return (
                <div key={day.key} className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{day.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{mealsCount} meals</span>
                    <div className={`w-3 h-3 rounded-full ${
                      mealsCount === 0 ? 'bg-red-200' :
                      mealsCount < 3 ? 'bg-yellow-200' :
                      'bg-green-200'
                    }`}></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              Total meals planned: {Object.values(data.mealPlan).flat().length}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Keep planning to maintain consistent eating habits!
            </p>
          </div>
        </div>
      </div>

      {/* All Meals Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Complete Week Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {days.map((day) => (
            <div key={day.key} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3 text-center">{day.label}</h4>
              {data.mealPlan[day.key].length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {data.mealPlan[day.key].map((meal, index) => (
                    <li key={index} className="text-gray-600 bg-gray-50 rounded px-2 py-1">
                      {meal}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-center text-xs py-4">No meals planned</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};