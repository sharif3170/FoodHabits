import React, { useState } from 'react';
import { FoodHabitData, Habit } from '../types/FoodHabit';
import { Plus, CheckCircle, XCircle, Flame, Target, Edit, Trash2 } from 'lucide-react';

interface HabitTrackerProps {
  data: FoodHabitData;
  updateData: (newData: Partial<FoodHabitData>) => void;
  user: { id: string } | null;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ data, updateData, user }) => {
  const apiBase = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    target: '',
    category: 'nutrition' as Habit['category']
  });

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.name || !newHabit.target) return;

    if (!user) return;

    const response = await fetch(`${apiBase}/api/habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        name: newHabit.name,
        target: parseInt(newHabit.target),
        category: newHabit.category
      })
    });
    const created = await response.json();

    const habit: Habit = {
      id: created._id,
      name: created.name,
      completed: created.completed,
      streak: created.streak,
      target: created.target,
      current: created.current,
      category: created.category
    };

    updateData({ habits: [...data.habits, habit] });
    setNewHabit({ name: '', target: '', category: 'nutrition' });
    setIsAddingHabit(false);
  };

  const toggleHabit = async (habitId: string) => {
    const existing = data.habits.find(h => h.id === habitId);
    if (!existing) return;
    const newCompleted = !existing.completed;
    const update = {
      completed: newCompleted,
      streak: newCompleted ? existing.streak + 1 : Math.max(0, existing.streak - 1),
      current: newCompleted ? existing.target : 0
    };
    updateData({ habits: data.habits.map(h => h.id === habitId ? { ...h, ...update } : h) });
    await fetch(`${apiBase}/api/habits/${habitId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });
  };

  const updateHabitProgress = async (habitId: string, newCurrent: number) => {
    const existing = data.habits.find(h => h.id === habitId);
    if (!existing) return;
    const completed = newCurrent >= existing.target;
    const update = {
      current: newCurrent,
      completed,
      streak: completed && !existing.completed ? existing.streak + 1 : existing.streak
    };
    updateData({ habits: data.habits.map(h => h.id === habitId ? { ...h, ...update } : h) });
    await fetch(`${apiBase}/api/habits/${habitId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });
  };

  const deleteHabit = async (habitId: string) => {
    updateData({ habits: data.habits.filter(habit => habit.id !== habitId) });
    await fetch(`${apiBase}/api/habits/${habitId}`, { method: 'DELETE' });
  };

  const categories = [
    { value: 'hydration', label: 'Hydration', color: 'blue' },
    { value: 'nutrition', label: 'Nutrition', color: 'green' },
    { value: 'diet', label: 'Diet', color: 'orange' },
    { value: 'meals', label: 'Meals', color: 'purple' },
    { value: 'exercise', label: 'Exercise', color: 'red' }
  ];

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : 'gray';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Habit Tracker</h2>
        <button
          onClick={() => setIsAddingHabit(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Habit</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Habits</p>
              <p className="text-2xl font-bold text-gray-900">{data.habits.length}</p>
            </div>
            <Target className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.habits.filter(h => h.completed).length}/{data.habits.length}
              </p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Longest Streak</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.max(...data.habits.map(h => h.streak), 0)}
              </p>
            </div>
            <Flame className="h-12 w-12 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Add Habit Modal */}
      {isAddingHabit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Habit</h3>
            <form onSubmit={handleAddHabit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Habit Name</label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g. Drink 8 glasses of water"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Daily Target</label>
                  <input
                    type="number"
                    value={newHabit.target}
                    onChange={(e) => setNewHabit({ ...newHabit, target: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="8"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newHabit.category}
                    onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value as Habit['category'] })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingHabit(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Habits List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Your Habits</h3>
        {data.habits.length > 0 ? (
          <div className="space-y-4">
            {data.habits.map((habit) => {
              const progress = (habit.current / habit.target) * 100;
              const colorClass = getCategoryColor(habit.category);
              
              return (
                <div key={habit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          habit.completed
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                        }`}
                      >
                        {habit.completed ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                      </button>
                      <div>
                        <h4 className="font-medium text-gray-800">{habit.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${colorClass}-100 text-${colorClass}-800`}>
                            {habit.category}
                          </span>
                          <span className="flex items-center space-x-1">
                            <Flame className="h-4 w-4 text-orange-500" />
                            <span>{habit.streak} days</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-gray-800">
                        {habit.current}/{habit.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-${colorClass}-500 h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min(100, progress)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateHabitProgress(habit.id, Math.max(0, habit.current - 1))}
                        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={habit.current}
                        onChange={(e) => updateHabitProgress(habit.id, parseInt(e.target.value) || 0)}
                        className="w-16 text-center text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <button
                        onClick={() => updateHabitProgress(habit.id, habit.current + 1)}
                        className="px-3 py-1 text-sm bg-green-200 text-green-700 rounded hover:bg-green-300 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No habits yet. Start building healthy habits today!</p>
        )}
      </div>
    </div>
  );
};