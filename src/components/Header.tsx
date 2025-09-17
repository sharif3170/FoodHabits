import React from 'react';
import { Apple, BarChart3, Calendar, Target, Utensils, CheckSquare, Database, LogOut, User as UserIcon, Info } from 'lucide-react';
import { User } from '../types/Auth';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, user, onSignOut }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'food-database', label: 'Food Info', icon: Database },
    { id: 'food-logger', label: 'Food Logger', icon: Apple },
    { id: 'habits', label: 'Habits', icon: CheckSquare },
    { id: 'meal-planner', label: 'Meal Planner', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="bg-white shadow-lg border-b-2 border-green-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <Utensils className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">FoodHabits</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <UserIcon className="h-5 w-5" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <button
                  onClick={onSignOut}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <nav className="hidden md:flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};