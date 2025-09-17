import React from 'react';
import { Heart, Leaf, ShieldCheck, Sparkles, Users } from 'lucide-react';

export const About: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: 'Health First',
      desc: 'We prioritize sustainable habits over quick fixes, helping you build a relationship with food that lasts.'
    },
    {
      icon: Leaf,
      title: 'Progress, Not Perfection',
      desc: 'Small daily actions compound into meaningful change. We celebrate every step forward.'
    },
    {
      icon: ShieldCheck,
      title: 'Privacy by Default',
      desc: 'Your data belongs to you. We store only what is needed to power your experience.'
    },
    {
      icon: Users,
      title: 'Built for Everyone',
      desc: 'Whether you are starting out or optimizing performance, FoodHabits adapts to your goals.'
    },
    {
      icon: Sparkles,
      title: 'Delightful Experience',
      desc: 'Fast, friendly, and thoughtfully designed so healthy choices feel easier every day.'
    }
  ];

  return (
    <div className="space-y-16">
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
        <div className="md:flex md:items-start md:justify-between gap-10">
          <div className="space-y-6 md:flex-1">
            <h1 className="text-4xl font-bold text-gray-800">About FoodHabits</h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              FoodHabits helps you understand what you eat, build consistent habits, and reach your health goals without
              complexity. We combine a clean interface with practical tools—food logging, habit tracking, goal setting,
              and progress insights—so you can focus on what matters: feeling better every day.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our mission is simple: make healthy choices more obvious and more achievable. No judgment, no extremes—just
              data you can trust and guidance that meets you where you are.
            </p>
          </div>
          <div className="mt-10 md:mt-0 md:w-80">
            <img
              src="https://images.pexels.com/photos/3296548/pexels-photo-3296548.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="People preparing healthy meals"
              className="rounded-2xl w-full h-56 object-cover shadow-md"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 text-white flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-1">{v.title}</div>
                <div className="text-gray-600">{v.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-8 md:p-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Where we are headed</h2>
        <p className="text-white/90 max-w-3xl">
          We are continuously improving our food database, adding smarter recommendations, and making it easier to
          collaborate with coaches and friends. If you have feedback or ideas, we would love to hear from you.
        </p>
      </section>
    </div>
  );
};



