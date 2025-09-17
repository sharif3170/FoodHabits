import React from 'react';
import { FoodHabitData } from '../types/FoodHabit';
import { Droplet, Apple, TrendingUp, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface DashboardProps {
  data: FoodHabitData;
  updateData: (newData: Partial<FoodHabitData>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, updateData }) => {
  const today = new Date().toDateString();
  const todaysEntries = data.foodLog.filter(entry => 
    new Date(entry.timestamp).toDateString() === today
  );
  
  const totalCalories = todaysEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const completedHabits = data.habits.filter(habit => habit.completed).length;
  const totalHabits = data.habits.length;
  const completionRate = totalHabits > 0 ? (completedHabits / totalHabits * 100) : 0;

  const toggleHabit = (habitId: string) => {
    const updatedHabits = data.habits.map(habit => {
      if (habit.id === habitId) {
        return {
          ...habit,
          completed: !habit.completed,
          streak: !habit.completed ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        };
      }
      return habit;
    });
    updateData({ habits: updatedHabits });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Your Food Journey</h2>
        <p className="text-gray-600">Track your habits, plan your meals, and achieve your goals</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Calories</p>
              <p className="text-2xl font-bold text-gray-900">{totalCalories}</p>
            </div>
            <Apple className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Habits Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedHabits}/{totalHabits}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate.toFixed(0)}%</p>
            </div>
            <TrendingUp className="h-12 w-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Goals</p>
              <p className="text-2xl font-bold text-gray-900">{data.goals.length}</p>
            </div>
            <Calendar className="h-12 w-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Quick Habit Tracker */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Habits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.habits.map((habit) => (
            <div key={habit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
                  <p className={`font-medium ${habit.completed ? 'text-green-700' : 'text-gray-700'}`}>
                    {habit.name}
                  </p>
                  <p className="text-sm text-gray-500">🔥 {habit.streak} day streak</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                habit.category === 'hydration' ? 'bg-blue-100 text-blue-800' :
                habit.category === 'nutrition' ? 'bg-green-100 text-green-800' :
                habit.category === 'diet' ? 'bg-orange-100 text-orange-800' :
                habit.category === 'meals' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {habit.category}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Food Log */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Food Log</h3>
        {todaysEntries.length > 0 ? (
          <div className="space-y-3">
            {todaysEntries.slice(-5).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">{entry.name}</p>
                  <p className="text-sm text-gray-500">{entry.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-700">{entry.calories} cal</p>
                  <p className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No food entries for today. Start logging your meals!</p>
        )}
      </div>

      {/* Goals Progress */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Goals Progress</h3>
        <div className="space-y-4">
          {data.goals.map((goal) => {
            const progress = Math.min(100, (goal.current / goal.target) * 100);
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-700">{goal.title}</p>
                  <p className="text-sm text-gray-500">{goal.current}/{goal.target} {goal.unit}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">Due: {new Date(goal.deadline).toLocaleDateString()}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};