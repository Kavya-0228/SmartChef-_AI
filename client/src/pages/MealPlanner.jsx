import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, Loader2, DollarSign, CheckCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const MealPlanner = () => {
  const [goal, setGoal] = useState('Maintain weight');
  const [budget, setBudget] = useState('Moderate');
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlan(null);

    try {
      const res = await axios.post(`${API_BASE_URL}/generate-meal-plan`, { goal, budget, days });
      setPlan(res.data);
    } catch (error) {
      console.error(error);
      alert('Failed to generate meal plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
          <Calendar className="w-10 h-10 text-accent-500" />
          Meal Planner
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Get beautifully structured weekly or monthly meal plans aligned with your goals.</p>
        
        <form onSubmit={handleGenerate} className="glass dark:glass-dark rounded-3xl p-6 md:p-8 mb-12 shadow-xl grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm font-bold mb-2">Health Goal</label>
            <select 
              value={goal} onChange={(e) => setGoal(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option>Maintain weight</option>
              <option>Weight loss</option>
              <option>Muscle gain</option>
              <option>Diabetic friendly</option>
              <option>Heart healthy</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-bold mb-2">Budget Range</label>
            <select 
              value={budget} onChange={(e) => setBudget(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option>Budget-friendly</option>
              <option>Moderate</option>
              <option>Premium</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-bold mb-2">Days (max 7)</label>
            <input 
              type="number" min="1" max="7" 
              value={days} onChange={(e) => setDays(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          <div className="md:col-span-1">
            <button 
              type="submit" disabled={loading}
              className="w-full p-4 bg-accent-500 text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-accent-600 transition disabled:opacity-70 shadow-lg shadow-accent-500/30"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calendar className="w-5 h-5" />}
              {loading ? 'Planning...' : 'Generate Plan'}
            </button>
          </div>
        </form>

        {plan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
              
              <div className="flex-1 space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2"><Calendar className="w-6 h-6 text-accent-500" /> Day-by-Day Plan</h2>
                {plan.days?.map((dayObj, idx) => (
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="glass dark:glass-dark rounded-2xl p-6"
                  >
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-black text-xl">Day {dayObj.day}</h3>
                      <span className="text-sm font-bold text-accent-500">{dayObj.total_calories} kcal</span>
                    </div>
                    <div className="space-y-3">
                      {dayObj.meals?.map((meal, mIdx) => (
                        <div key={mIdx} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                          <div>
                            <span className="text-xs uppercase font-bold text-gray-400">{meal.type}</span>
                            <p className="font-medium">{meal.dish}</p>
                          </div>
                          <span className="text-sm font-semibold whitespace-nowrap ml-4 text-gray-500">{meal.calories} cal</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="md:w-80 space-y-6">
                <div className="glass dark:glass-dark rounded-2xl p-6 border-t-4 border-primary-500">
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary-500"/> Grocery List</h3>
                  <ul className="space-y-2">
                    {plan.grocery_list?.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="glass dark:glass-dark rounded-2xl p-6 border-t-4 border-yellow-500">
                  <h3 className="font-bold text-xl mb-2 flex items-center gap-2"><DollarSign className="w-5 h-5 text-yellow-500"/> Overview</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2"><strong>Suitability:</strong> {plan.goal_suitability}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Est. Budget:</strong> {plan.overall_budget_estimate}</p>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;
