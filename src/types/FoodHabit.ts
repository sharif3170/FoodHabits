export interface Habit {
  id: string;
  name: string;
  completed: boolean;
  streak: number;
  target: number;
  current: number;
  category: 'hydration' | 'nutrition' | 'diet' | 'meals' | 'exercise';
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: string;
  nutrients?: {
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
}

export interface MealPlan {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

export interface FoodHabitData {
  habits: Habit[];
  foodLog: FoodEntry[];
  goals: Goal[];
  mealPlan: MealPlan;
}