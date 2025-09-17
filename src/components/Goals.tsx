import React, { useState } from 'react';
import { FoodHabitData, Goal } from '../types/FoodHabit';
import { Plus, Target, Calendar, TrendingUp, Trash2, Edit } from 'lucide-react';

interface GoalsProps {
  data: FoodHabitData;
  updateData: (newData: Partial<FoodHabitData>) => void;
  user: { id: string } | null;
}

export const Goals: React.FC<GoalsProps> = ({ data, updateData, user }) => {
  const apiBase = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    current: '',
    unit: '',
    deadline: ''
  });

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.target || !newGoal.unit || !newGoal.deadline) return;

    if (!user) return;

    const response = await fetch(`${apiBase}/api/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        title: newGoal.title,
        target: parseInt(newGoal.target),
        current: parseInt(newGoal.current) || 0,
        unit: newGoal.unit,
        deadline: newGoal.deadline
      })
    });
    if (!response.ok) {
      resetForm();
      return;
    }
    const created = await response.json();

    const goal: Goal = {
      id: created._id,
      title: created.title || newGoal.title,
      target: Number(created.target) || parseInt(newGoal.target) || 0,
      current: Number(created.current) || parseInt(newGoal.current) || 0,
      unit: created.unit,
      deadline: created.deadline
    };

    updateData({ goals: [...data.goals, goal] });
    resetForm();
  };

  const handleUpdateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal || !newGoal.title || !newGoal.target || !newGoal.unit || !newGoal.deadline) return;
    const update = {
      title: newGoal.title,
      target: parseInt(newGoal.target),
      current: parseInt(newGoal.current) || 0,
      unit: newGoal.unit,
      deadline: newGoal.deadline
    };
    updateData({ goals: data.goals.map(goal => goal.id === editingGoal.id ? { ...goal, ...update } : goal) });
    await fetch(`${apiBase}/api/goals/${editingGoal.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });
    resetForm();
  };

  const updateGoalProgress = async (goalId: string, newCurrent: number) => {
    updateData({ goals: data.goals.map(goal => goal.id === goalId ? { ...goal, current: Math.max(0, newCurrent) } : goal) });
    await fetch(`${apiBase}/api/goals/${goalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current: Math.max(0, newCurrent) })
    });
  };

  const deleteGoal = async (goalId: string) => {
    updateData({ goals: data.goals.filter(goal => goal.id !== goalId) });
    await fetch(`${apiBase}/api/goals/${goalId}`, { method: 'DELETE' });
  };

  const startEditing = (goal: Goal) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal.title,
      target: goal.target.toString(),
      current: goal.current.toString(),
      unit: goal.unit,
      deadline: goal.deadline
    });
    setIsAddingGoal(true);
  };

  const resetForm = () => {
    setNewGoal({
      title: '',
      target: '',
      current: '',
      unit: '',
      deadline: ''
    });
    setIsAddingGoal(false);
    setEditingGoal(null);
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGoalStatus = (goal: Goal) => {
    const numericCurrent = typeof goal.current === 'number' ? goal.current : parseFloat(String(goal.current)) || 0;
    const numericTarget = typeof goal.target === 'number' ? goal.target : parseFloat(String(goal.target)) || 0;
    const safeProgress = numericTarget > 0 ? (numericCurrent / numericTarget) * 100 : 0;
    const progress = safeProgress;
    const daysLeft = getDaysUntilDeadline(goal.deadline);
    
    if (progress >= 100) return { status: 'completed', color: 'green' };
    if (daysLeft < 0) return { status: 'overdue', color: 'red' };
    if (daysLeft <= 7) return { status: 'urgent', color: 'orange' };
    return { status: 'on-track', color: 'blue' };
  };

  const goalSuggestions = [
    { title: 'Lose weight', target: 10, unit: 'lbs', days: 90 },
    { title: 'Gain muscle', target: 5, unit: 'lbs', days: 120 },
    { title: 'Drink more water', target: 64, unit: 'oz/day', days: 30 },
    { title: 'Exercise regularly', target: 4, unit: 'times/week', days: 60 },
    { title: 'Eat vegetables', target: 5, unit: 'servings/day', days: 30 },
    { title: 'Reduce sugar intake', target: 50, unit: 'g/day', days: 45 }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Goals</h2>
        <button
          onClick={() => setIsAddingGoal(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{data.goals.length}</h3>
          <p className="text-sm text-gray-600">Total Goals</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {data.goals.filter(g => (Number(g.current) || 0) >= (Number(g.target) || 0)).length}
          </h3>
          <p className="text-sm text-gray-600">Completed</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4">
            <Calendar className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {data.goals.filter(g => getDaysUntilDeadline(g.deadline) <= 7 && (Number(g.current) || 0) < (Number(g.target) || 0)).length}
          </h3>
          <p className="text-sm text-gray-600">Due Soon</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
            <Target className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {(() => {
              const valid = data.goals
                .map(g => ({ c: Number(g.current) || 0, t: Number(g.target) || 0 }))
                .filter(g => g.t > 0);
              if (valid.length === 0) return 0;
              const avg = valid.reduce((sum, g) => sum + (g.c / g.t), 0) / valid.length * 100;
              return Number.isFinite(avg) ? avg.toFixed(0) : 0;
            })()}%
          </h3>
          <p className="text-sm text-gray-600">Avg Progress</p>
        </div>
      </div>

      {/* Add/Edit Goal Modal */}
      {isAddingGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingGoal ? 'Edit Goal' : 'Add New Goal'}
            </h3>
            
            {!editingGoal && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Quick suggestions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {goalSuggestions.slice(0, 4).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const deadline = new Date();
                        deadline.setDate(deadline.getDate() + suggestion.days);
                        setNewGoal({
                          title: suggestion.title,
                          target: suggestion.target.toString(),
                          current: '0',
                          unit: suggestion.unit,
                          deadline: deadline.toISOString().split('T')[0]
                        });
                      }}
                      className="p-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-green-100 hover:text-green-700 transition-colors"
                    >
                      {suggestion.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g. Lose 10 pounds"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target</label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <input
                    type="text"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="lbs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Progress</label>
                  <input
                    type="number"
                    value={newGoal.current}
                    onChange={(e) => setNewGoal({ ...newGoal, current: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingGoal ? 'Update Goal' : 'Add Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Your Goals</h3>
        {data.goals.length > 0 ? (
          <div className="space-y-4">
            {data.goals.map((goal) => {
              const numericCurrent = typeof goal.current === 'number' ? goal.current : parseFloat(String(goal.current)) || 0;
              const numericTarget = typeof goal.target === 'number' ? goal.target : parseFloat(String(goal.target)) || 0;
              const rawProgress = numericTarget > 0 ? (numericCurrent / numericTarget) * 100 : 0;
              const progress = Math.min(100, rawProgress);
              const daysLeft = getDaysUntilDeadline(goal.deadline);
              const goalStatus = getGoalStatus(goal);
              
              return (
                <div key={goal.id} className={`border-l-4 border-${goalStatus.color}-500 bg-gray-50 rounded-lg p-4`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-lg">{goal.title || 'Untitled Goal'}</h4>
                      <p className="text-sm text-gray-600">
                        Target: {goal.target} {goal.unit} | Due: {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditing(goal)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Progress</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-800">
                          {numericCurrent}/{numericTarget} {goal.unit}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${goalStatus.color}-100 text-${goalStatus.color}-800`}>
                          {goalStatus.status === 'completed' ? 'Completed' :
                           goalStatus.status === 'overdue' ? 'Overdue' :
                           goalStatus.status === 'urgent' ? `${daysLeft} days left` :
                           `${daysLeft} days left`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`bg-${goalStatus.color}-500 h-3 rounded-full transition-all duration-300 relative`}
                        style={{ width: `${progress}%` }}
                      >
                        {progress > 15 && (
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                            {progress.toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateGoalProgress(goal.id, goal.current - 1)}
                        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                      >
                        -1
                      </button>
                      <input
                        type="number"
                        value={goal.current}
                        onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value) || 0)}
                        className="w-20 text-center text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <button
                        onClick={() => updateGoalProgress(goal.id, goal.current + 1)}
                        className="px-3 py-1 text-sm bg-green-200 text-green-700 rounded hover:bg-green-300 transition-colors"
                      >
                        +1
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No goals set yet</p>
            <p className="text-gray-400 text-sm mb-6">Start setting goals to track your progress and stay motivated</p>
            <button
              onClick={() => setIsAddingGoal(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Set Your First Goal
            </button>
          </div>
        )}
      </div>

      {/* Motivational Section */}
      {data.goals.length > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Keep Going! 💪</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">
                {data.goals.filter(g => (Number(g.current) || 0) >= (Number(g.target) || 0)).length}
              </div>
              <p className="text-sm opacity-90">Goals Completed</p>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {(() => {
                  const valid = data.goals
                    .map(g => ({ c: Number(g.current) || 0, t: Number(g.target) || 0 }))
                    .filter(g => g.t > 0);
                  if (valid.length === 0) return 0;
                  const avg = valid.reduce((sum, g) => sum + (g.c / g.t), 0) / valid.length * 100;
                  return Number.isFinite(avg) ? avg.toFixed(0) : 0;
                })()}%
              </div>
              <p className="text-sm opacity-90">Average Progress</p>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {data.goals.filter(g => getDaysUntilDeadline(g.deadline) > 0 && (Number(g.current) || 0) < (Number(g.target) || 0)).length}
              </div>
              <p className="text-sm opacity-90">Goals in Progress</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};