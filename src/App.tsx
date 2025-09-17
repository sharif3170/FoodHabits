import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/Auth/AuthModal';
import { FoodDatabase } from './components/FoodInfo/FoodDatabase';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { FoodLogger } from './components/FoodLogger';
import { HabitTracker } from './components/HabitTracker';
import { MealPlanner } from './components/MealPlanner';
import { Progress } from './components/Progress';
import { Goals } from './components/Goals';
import { About } from './components/About';
import { FoodHabitData } from './types/FoodHabit';
import { User } from './types/Auth';

const defaultData: FoodHabitData = {
  habits: [
    { id: '1', name: 'Drink 8 glasses of water', completed: false, streak: 5, target: 8, current: 0, category: 'hydration' },
    { id: '2', name: 'Eat 5 servings of fruits/vegetables', completed: false, streak: 3, target: 5, current: 0, category: 'nutrition' },
    { id: '3', name: 'No processed foods', completed: false, streak: 2, target: 1, current: 0, category: 'diet' },
    { id: '4', name: 'Eat breakfast', completed: false, streak: 7, target: 1, current: 0, category: 'meals' },
  ],
  foodLog: [],
  goals: [
    { id: '1', title: 'Lose 10 pounds', target: 10, current: 3, unit: 'lbs', deadline: '2025-03-01' },
    { id: '2', title: 'Exercise 4x per week', target: 4, current: 2, unit: 'times/week', deadline: '2025-02-15' },
  ],
  mealPlan: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  }
};

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('foodHabitsUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLanding, setShowLanding] = useState(!user);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<FoodHabitData>(() => {
    if (!user) return defaultData;
    const saved = localStorage.getItem(`foodHabitsData_${user.id}`);
    return saved ? JSON.parse(saved) : defaultData;
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null; visible: boolean }>({
    message: '',
    type: null,
    visible: false
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(`foodHabitsData_${user.id}`, JSON.stringify(data));
    }
  }, [data, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('foodHabitsUser', JSON.stringify(user));
    }
  }, [user]);

  const handleAuth = (userData: { email: string; name: string; id?: string }) => {
    const newUser: User = {
      id: userData.id || Date.now().toString(),
      email: userData.email,
      name: userData.name,
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    setShowLanding(false);
    setShowAuthModal(false);
    
    // Load user-specific data or create new
    const saved = localStorage.getItem(`foodHabitsData_${newUser.id}`);
    setData(saved ? JSON.parse(saved) : defaultData);

    // Show success toast
    setToast({ message: `Welcome, ${newUser.name}!`, type: 'success', visible: true });
    window.setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleSignOut = () => {
    setUser(null);
    setShowLanding(true);
    setActiveTab('dashboard');
    localStorage.removeItem('foodHabitsUser');
  };

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const updateData = (newData: Partial<FoodHabitData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={data} updateData={updateData} />;
      case 'food-database':
        return <FoodDatabase />;
      case 'food-logger':
        return <FoodLogger data={data} updateData={updateData} user={user} />;
      case 'habits':
        return <HabitTracker data={data} updateData={updateData} user={user} />;
      case 'meal-planner':
        return <MealPlanner data={data} updateData={updateData} user={user} />;
      case 'progress':
        return <Progress data={data} />;
      case 'goals':
        return <Goals data={data} updateData={updateData} user={user} />;
      case 'about':
        return <About />;
      default:
        return <Dashboard data={data} updateData={updateData} />;
    }
  };

  if (showLanding) {
    return (
      <>
        <LandingPage onGetStarted={handleGetStarted} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuth={handleAuth}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        user={user}
        onSignOut={handleSignOut}
      />
      <main className="container mx-auto px-4 py-8">
        {renderActiveTab()}
      </main>
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`rounded-lg shadow-lg px-4 py-3 text-sm flex items-center gap-2 border ${
            toast.type === 'success'
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;