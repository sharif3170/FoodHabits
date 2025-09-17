import React from 'react';
import { Utensils, Target, TrendingUp, Users, Star, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Utensils,
      title: 'Food Tracking',
      description: 'Log your meals and track nutritional intake with our comprehensive food database.'
    },
    {
      icon: Target,
      title: 'Goal Setting',
      description: 'Set personalized health goals and track your progress with detailed analytics.'
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Visualize your journey with charts, streaks, and achievement tracking.'
    },
    {
      icon: Users,
      title: 'Habit Building',
      description: 'Build lasting healthy habits with our intuitive habit tracking system.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      text: 'FoodHabits helped me lose 20 pounds and build sustainable eating habits. The tracking features are amazing!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      text: 'As a fitness enthusiast, this app helps me track my macros perfectly. The food database is comprehensive.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
      text: 'The habit tracking feature is a game-changer. I\'ve maintained my healthy eating streak for 3 months!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                  Transform Your
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                    {' '}Food Habits
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Track your nutrition, build healthy habits, and achieve your wellness goals with our comprehensive food tracking platform.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-green-500 hover:text-green-600 transition-all duration-300">
                  Watch Demo
                </button>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Free to use</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Start immediately</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl transform rotate-6 opacity-20"></div>
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Healthy Food"
                className="relative rounded-3xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools to help you build and maintain healthy eating habits
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-green-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-green-100">Meals Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-100">Food Items</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-green-100">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Join thousands of people who transformed their eating habits</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">Verified User</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Ready to Start Your Health Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of users who have already transformed their eating habits with FoodHabits.
            </p>
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-12 py-4 rounded-xl font-semibold text-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Your Free Journey Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};