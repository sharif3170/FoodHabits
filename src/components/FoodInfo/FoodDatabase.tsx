import React, { useState } from 'react';
import { Search, Star, Clock, Users, X } from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  category: string;
  benefits: string[];
  description: string;
  servingSize: string;
  cookingTime?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  rating: number;
}

const foodDatabase: FoodItem[] = [
  {
    id: '1',
    name: 'Avocado',
    image: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=400',
    calories: 234,
    protein: 4,
    carbs: 12,
    fat: 21,
    fiber: 10,
    category: 'Fruits',
    benefits: ['Heart Health', 'Weight Management', 'Nutrient Dense'],
    description: 'Rich in healthy monounsaturated fats, fiber, and potassium. Great for heart health and provides sustained energy.',
    servingSize: '1 medium (150g)',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Salmon',
    image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=400',
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 12,
    fiber: 0,
    category: 'Protein',
    benefits: ['Omega-3 Fatty Acids', 'Brain Health', 'Anti-inflammatory'],
    description: 'Excellent source of high-quality protein and omega-3 fatty acids. Supports brain function and reduces inflammation.',
    servingSize: '100g fillet',
    cookingTime: '15-20 min',
    difficulty: 'Medium',
    rating: 4.9
  },
  {
    id: '3',
    name: 'Quinoa',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    calories: 222,
    protein: 8,
    carbs: 39,
    fat: 4,
    fiber: 5,
    category: 'Grains',
    benefits: ['Complete Protein', 'Gluten-Free', 'High Fiber'],
    description: 'A complete protein grain containing all essential amino acids. Perfect for vegetarians and those avoiding gluten.',
    servingSize: '1 cup cooked (185g)',
    cookingTime: '15 min',
    difficulty: 'Easy',
    rating: 4.6
  },
  {
    id: '4',
    name: 'Blueberries',
    image: 'https://images.pexels.com/photos/2161643/pexels-photo-2161643.jpeg?auto=compress&cs=tinysrgb&w=400',
    calories: 84,
    protein: 1,
    carbs: 21,
    fat: 0,
    fiber: 4,
    category: 'Fruits',
    benefits: ['Antioxidants', 'Brain Health', 'Low Calorie'],
    description: 'Packed with antioxidants and vitamin C. Known to improve memory and cognitive function.',
    servingSize: '1 cup (148g)',
    rating: 4.7
  },
  {
    id: '5',
    name: 'Greek Yogurt',
    image: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=400',
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0,
    fiber: 0,
    category: 'Dairy',
    benefits: ['Probiotics', 'High Protein', 'Bone Health'],
    description: 'Rich in probiotics and protein. Supports digestive health and provides sustained energy.',
    servingSize: '170g container',
    rating: 4.5
  },
  {
    id: '6',
    name: 'Sweet Potato',
    image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=400',
    calories: 112,
    protein: 2,
    carbs: 26,
    fat: 0,
    fiber: 4,
    category: 'Vegetables',
    benefits: ['Vitamin A', 'Complex Carbs', 'Antioxidants'],
    description: 'High in beta-carotene and complex carbohydrates. Provides steady energy and supports eye health.',
    servingSize: '1 medium (128g)',
    cookingTime: '45 min',
    difficulty: 'Easy',
    rating: 4.4
  },
  {
    id: '7',
    name: 'Spinach',
    image: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=400',
    calories: 23,
    protein: 3,
    carbs: 4,
    fat: 0,
    fiber: 2,
    category: 'Vegetables',
    benefits: ['Iron', 'Folate', 'Low Calorie'],
    description: 'Nutrient-dense leafy green rich in iron, folate, and vitamins. Perfect for salads and smoothies.',
    servingSize: '100g raw',
    rating: 4.3
  },
  {
    id: '8',
    name: 'Almonds',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=400',
    calories: 579,
    protein: 21,
    carbs: 22,
    fat: 50,
    fiber: 12,
    category: 'Nuts',
    benefits: ['Healthy Fats', 'Vitamin E', 'Heart Health'],
    description: 'Rich in healthy fats, protein, and vitamin E. Great for heart health and sustained energy.',
    servingSize: '100g (about 23 nuts)',
    rating: 4.6
  }
];

export const FoodDatabase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const categories = ['All', ...Array.from(new Set(foodDatabase.map(food => food.category)))];

  const filteredFoods = foodDatabase.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.benefits.some(benefit => benefit.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Food Database</h2>
        <p className="text-gray-600">Discover nutritious foods and their health benefits</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search foods or benefits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFoods.map((food) => (
          <div
            key={food.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
            onClick={() => setSelectedFood(food)}
          >
            <div className="relative">
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 text-xs font-medium text-gray-700">
                {food.category}
              </div>
              <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-white rounded-full px-2 py-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs font-medium">{food.rating}</span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{food.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{food.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                <div>Calories: <span className="font-medium">{food.calories}</span></div>
                <div>Protein: <span className="font-medium">{food.protein}g</span></div>
                <div>Carbs: <span className="font-medium">{food.carbs}g</span></div>
                <div>Fat: <span className="font-medium">{food.fat}g</span></div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {food.benefits.slice(0, 2).map((benefit, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    {benefit}
                  </span>
                ))}
                {food.benefits.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{food.benefits.length - 2} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Food Detail Modal */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedFood.image}
                alt={selectedFood.name}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                onClick={() => setSelectedFood(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedFood.name}</h2>
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-medium">{selectedFood.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">{selectedFood.description}</p>
              
              {/* Nutrition Facts */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Nutrition Facts</h3>
                <p className="text-sm text-gray-600 mb-3">Per {selectedFood.servingSize}</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedFood.calories}</div>
                    <div className="text-xs text-gray-600">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedFood.protein}g</div>
                    <div className="text-xs text-gray-600">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{selectedFood.carbs}g</div>
                    <div className="text-xs text-gray-600">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedFood.fat}g</div>
                    <div className="text-xs text-gray-600">Fat</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{selectedFood.fiber}g</div>
                    <div className="text-xs text-gray-600">Fiber</div>
                  </div>
                </div>
              </div>
              
              {/* Cooking Info */}
              {(selectedFood.cookingTime || selectedFood.difficulty) && (
                <div className="flex items-center space-x-6 mb-6">
                  {selectedFood.cookingTime && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-600">{selectedFood.cookingTime}</span>
                    </div>
                  )}
                  {selectedFood.difficulty && (
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-600">{selectedFood.difficulty}</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Health Benefits */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Health Benefits</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedFood.benefits.map((benefit, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-green-100 text-green-800 text-sm rounded-full"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};