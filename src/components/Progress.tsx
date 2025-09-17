import React from 'react';
import { FoodHabitData } from '../types/FoodHabit';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';

interface ProgressProps {
  data: FoodHabitData;
}

export const Progress: React.FC<ProgressProps> = ({ data }) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  const getCaloriesForDate = (date: Date) => {
    const dateString = date.toDateString();
    return data.foodLog
      .filter(entry => new Date(entry.timestamp).toDateString() === dateString)
      .reduce((sum, entry) => sum + entry.calories, 0);
  };

  const caloriesData = last7Days.map(date => ({
    date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    calories: getCaloriesForDate(date)
  }));

  const maxCalories = Math.max(...caloriesData.map(d => d.calories), 2000);
  const avgCalories = caloriesData.reduce((sum, d) => sum + d.calories, 0) / 7;

  const completedHabitsToday = data.habits.filter(h => h.completed).length;
  const totalHabits = data.habits.length;
  const habitCompletionRate = totalHabits > 0 ? (completedHabitsToday / totalHabits) * 100 : 0;

  const totalStreak = data.habits.reduce((sum, habit) => sum + habit.streak, 0);
  const avgStreak = totalHabits > 0 ? totalStreak / totalHabits : 0;

  const goalsCompleted = data.goals.filter(goal => (Number(goal.current) || 0) >= (Number(goal.target) || 0)).length;
  const goalsInProgress = data.goals.filter(goal => (Number(goal.current) || 0) < (Number(goal.target) || 0)).length;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Progress</h2>
        <p className="text-gray-600">Track your journey and celebrate your achievements</p>
      </div>

      {/* Progress Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{avgCalories.toFixed(0)}</h3>
          <p className="text-sm text-gray-600">Avg Daily Calories</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
            <Target className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{habitCompletionRate.toFixed(0)}%</h3>
          <p className="text-sm text-gray-600">Habit Completion</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4">
            <TrendingUp className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{avgStreak.toFixed(1)}</h3>
          <p className="text-sm text-gray-600">Avg Streak</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
            <Award className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{goalsCompleted}</h3>
          <p className="text-sm text-gray-600">Goals Achieved</p>
        </div>
      </div>

      {/* Calorie Tracking Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">7-Day Calorie Tracking</h3>
        <div className="space-y-4">
          {caloriesData.map((day, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-20 text-sm font-medium text-gray-600">
                {day.date}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-6 rounded-full transition-all duration-500"
                  style={{ width: `${(day.calories / maxCalories) * 100}%` }}
                ></div>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                  {day.calories} cal
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Weekly Average: <span className="font-medium">{avgCalories.toFixed(0)} calories/day</span>
          </p>
        </div>
      </div>

      {/* Habit Progress */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Habit Streaks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.habits.map((habit) => (
            <div key={habit.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800">{habit.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  habit.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {habit.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Current Streak</span>
                  <span className="font-medium">{habit.streak} days</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Today's Progress</span>
                  <span className="font-medium">{habit.current}/{habit.target}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (habit.current / habit.target) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goals Progress */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Goals Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{goalsCompleted}</div>
            <p className="text-green-800 font-medium">Completed Goals</p>
          </div>
          
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{goalsInProgress}</div>
            <p className="text-blue-800 font-medium">In Progress</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {data.goals.map((goal) => {
            const c = Number(goal.current) || 0;
            const t = Number(goal.target) || 0;
            const progress = Math.min(100, t > 0 ? (c / t) * 100 : 0);
            const isCompleted = c >= t && t > 0;
            
            return (
              <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{goal.title || 'Untitled Goal'}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isCompleted ? 'Achieved' : 'In Progress'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{c}/{t} {goal.unit}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                    <span className="text-gray-500">{progress.toFixed(0)}% complete</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.habits.filter(h => h.streak >= 7).length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🏆</div>
              <h4 className="font-medium text-yellow-800">Week Warrior</h4>
              <p className="text-xs text-yellow-700">7+ day streak achieved</p>
            </div>
          )}
          
          {completedHabitsToday === totalHabits && totalHabits > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">✨</div>
              <h4 className="font-medium text-green-800">Perfect Day</h4>
              <p className="text-xs text-green-700">All habits completed today</p>
            </div>
          )}
          
          {goalsCompleted > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-medium text-purple-800">Goal Crusher</h4>
              <p className="text-xs text-purple-700">{goalsCompleted} goals achieved</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};