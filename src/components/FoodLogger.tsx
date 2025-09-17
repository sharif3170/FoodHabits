import React, { useState } from 'react';
import { FoodHabitData, FoodEntry } from '../types/FoodHabit';
import { Plus, Search, Trash2, Edit } from 'lucide-react';

interface FoodLoggerProps {
  data: FoodHabitData;
  updateData: (newData: Partial<FoodHabitData>) => void;
  user: { id: string } | null;
}

export const FoodLogger: React.FC<FoodLoggerProps> = ({ data, updateData, user }) => {
  const apiBase = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newFood, setNewFood] = useState({
    name: '',
    calories: '',
    category: 'breakfast' as FoodEntry['category'],
    protein: '',
    carbs: '',
    fat: ''
  });

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFood.name || !newFood.calories) return;
    const timestamp = new Date().toISOString();
    const foodEntry: FoodEntry = {
      id: Date.now().toString(),
      name: newFood.name,
      calories: parseInt(newFood.calories),
      category: newFood.category,
      timestamp,
      nutrients: {
        protein: newFood.protein ? parseInt(newFood.protein) : undefined,
        carbs: newFood.carbs ? parseInt(newFood.carbs) : undefined,
        fat: newFood.fat ? parseInt(newFood.fat) : undefined,
      }
    };

    updateData({ foodLog: [...data.foodLog, foodEntry] });

    if (user) {
      const date = timestamp.slice(0, 10);
      const items = data.foodLog
        .filter(entry => entry.timestamp.slice(0,10) === date)
        .concat(foodEntry)
        .map(entry => ({
          name: entry.name,
          calories: entry.calories,
          protein: entry.nutrients?.protein || 0,
          carbs: entry.nutrients?.carbs || 0,
          fat: entry.nutrients?.fat || 0,
          quantity: 1,
          unit: 'serving'
        }));
      await fetch(`${apiBase}/api/food-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, date, items })
      });
    }
    setNewFood({
      name: '',
      calories: '',
      category: 'breakfast',
      protein: '',
      carbs: '',
      fat: ''
    });
    setIsAddingFood(false);
  };

  const deleteFood = async (id: string) => {
    const updatedLog = data.foodLog.filter(entry => entry.id !== id);
    updateData({ foodLog: updatedLog });
    // Optional: could re-sync the day via POST upsert
    if (user) {
      const date = new Date().toISOString().slice(0, 10);
      const items = updatedLog
        .filter(entry => entry.timestamp.slice(0,10) === date)
        .map(entry => ({
          name: entry.name,
          calories: entry.calories,
          protein: entry.nutrients?.protein || 0,
          carbs: entry.nutrients?.carbs || 0,
          fat: entry.nutrients?.fat || 0,
          quantity: 1,
          unit: 'serving'
        }));
      await fetch(`${apiBase}/api/food-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, date, items })
      });
    }
  };

  const filteredLog = data.foodLog.filter(entry =>
    entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todaysEntries = filteredLog.filter(entry =>
    new Date(entry.timestamp).toDateString() === new Date().toDateString()
  );

  const totalCaloriesToday = todaysEntries.reduce((sum, entry) => sum + entry.calories, 0);

  const categories = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Food Logger</h2>
        <button
          onClick={() => setIsAddingFood(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Food</span>
        </button>
      </div>

      {/* Today's Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{totalCaloriesToday}</p>
            <p className="text-gray-600">Total Calories</p>
          </div>
          {categories.map(category => {
            const categoryEntries = todaysEntries.filter(entry => entry.category === category);
            const categoryCalories = categoryEntries.reduce((sum, entry) => sum + entry.calories, 0);
            return (
              <div key={category} className="text-center">
                <p className="text-2xl font-bold text-gray-800">{categoryCalories}</p>
                <p className="text-gray-600 capitalize">{category}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search food entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Add Food Modal */}
      {isAddingFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Food Entry</h3>
            <form onSubmit={handleAddFood} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Food Name</label>
                <input
                  type="text"
                  value={newFood.name}
                  onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g. Grilled Chicken Breast"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
                  <input
                    type="number"
                    value={newFood.calories}
                    onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="250"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newFood.category}
                    onChange={(e) => setNewFood({ ...newFood, category: e.target.value as FoodEntry['category'] })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Protein (g)</label>
                  <input
                    type="number"
                    value={newFood.protein}
                    onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Carbs (g)</label>
                  <input
                    type="number"
                    value={newFood.carbs}
                    onChange={(e) => setNewFood({ ...newFood, carbs: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fat (g)</label>
                  <input
                    type="number"
                    value={newFood.fat}
                    onChange={(e) => setNewFood({ ...newFood, fat: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingFood(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Food
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Food Log */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Entries</h3>
        {filteredLog.length > 0 ? (
          <div className="space-y-3">
            {filteredLog.slice().reverse().slice(0, 20).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{entry.name}</h4>
                    <button
                      onClick={() => deleteFood(entry.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      entry.category === 'breakfast' ? 'bg-yellow-100 text-yellow-800' :
                      entry.category === 'lunch' ? 'bg-green-100 text-green-800' :
                      entry.category === 'dinner' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {entry.category}
                    </span>
                    <span className="font-medium">{entry.calories} cal</span>
                    {entry.nutrients?.protein && <span>Protein: {entry.nutrients.protein}g</span>}
                    {entry.nutrients?.carbs && <span>Carbs: {entry.nutrients.carbs}g</span>}
                    {entry.nutrients?.fat && <span>Fat: {entry.nutrients.fat}g</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No food entries found. Start tracking your meals!</p>
        )}
      </div>
    </div>
  );
};