import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader2, ChefHat, Clock, Utensils, Apple } from 'lucide-react';
import NutritionDisplay from '../components/NutritionDisplay';
import useLocalStorage from '../hooks/useLocalStorage';

const API_BASE_URL = 'http://localhost:5000/api';

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState('');
  const [diet, setDiet] = useState('none');
  const [cuisine, setCuisine] = useState('any');
  const [spice, setSpice] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [history, setHistory] = useLocalStorage('recipeHistory', []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!ingredients) return;

    setLoading(true);
    setRecipe(null);

    try {
      const res = await axios.post(`${API_BASE_URL}/generate-recipe`, {
        ingredients,
        diet: diet !== 'none' ? diet : null,
        cuisine: cuisine !== 'any' ? cuisine : null,
        spice_level: spice
      });
      const data = res.data;
      setRecipe(data);
      setHistory([data, ...history].slice(0, 5)); // Keep last 5
    } catch (error) {
      console.error(error);
      alert('Failed to generate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
          <ChefHat className="w-10 h-10 text-primary-500" />
          Recipe Generator
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Tell us what you have, and we'll cook up a recipe for you!</p>
        
        <form onSubmit={handleGenerate} className="glass dark:glass-dark rounded-3xl p-6 md:p-8 mb-12 shadow-xl">
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">Ingredients (comma separated)</label>
            <input 
              type="text" 
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g. Chicken, broccoli, garlic, soy sauce"
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold mb-2">Diet Preference</label>
              <select 
                value={diet} onChange={(e) => setDiet(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:focus:ring-primary-500"
              >
                <option value="none">None</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Cuisine</label>
              <select 
                value={cuisine} onChange={(e) => setCuisine(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:focus:ring-primary-500"
              >
                <option value="any">Any</option>
                <option value="italian">Italian</option>
                <option value="indian">Indian</option>
                <option value="mexican">Mexican</option>
                <option value="asian">Asian Fusion</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Spice Level</label>
              <select 
                value={spice} onChange={(e) => setSpice(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:focus:ring-primary-500"
              >
                <option value="mild">Mild</option>
                <option value="medium">Medium</option>
                <option value="spicy">Spicy</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600 transition flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-primary-500/20"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <SparklesIcon className="w-6 h-6" />}
            {loading ? 'Consulting the Chef...' : 'Generate Recipe'}
          </button>
        </form>

        {recipe && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="glass dark:glass-dark rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 opacity-10 rounded-bl-full"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-3xl font-black text-gradient">{recipe.dish_name}</h2>
                <div className="flex gap-4">
                  <span className="flex items-center gap-1 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg shadow-sm font-medium text-sm">
                    <Clock className="w-4 h-4 text-primary-500" /> {recipe.cooking_time}
                  </span>
                  <span className="flex items-center gap-1 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg shadow-sm font-medium text-sm capitalize">
                    <Utensils className="w-4 h-4 text-accent-500" /> {recipe.meal_type || 'Main Course'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-1">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Apple className="w-5 h-5 text-primary-500" /> Ingredients
                  </h3>
                  <ul className="space-y-2">
                    {recipe.ingredients?.map((ing, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-primary-500"></div> {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-primary-500" /> Instructions
                  </h3>
                  <ol className="space-y-4">
                    {recipe.cooking_steps?.map((step, idx) => (
                      <li key={idx} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <p className="pt-1 text-gray-700 dark:text-gray-300">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <NutritionDisplay nutrition={recipe} />
            </div>
          </motion.div>
        )}

        {history.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-gray-500" /> Recent Recipes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {history.map((histItem, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setRecipe(histItem)}
                  className="glass dark:glass-dark p-4 rounded-2xl cursor-pointer hover:shadow-primary-500/20 hover:border-primary-500/50 transition duration-300"
                >
                  <h4 className="font-bold text-lg text-primary-600 dark:text-primary-400 mb-2 truncate">{histItem.dish_name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-3">{histItem.meal_type || 'Main Course'} • {histItem.calories} kcal</p>
                  <div className="flex gap-2 flex-wrap">
                    {histItem.health_benefits?.slice(0, 2).map((b, i) => (
                      <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md max-w-[100px] truncate">{b}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper SparklesIcon
const SparklesIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3v13"/><path d="M19 10L12 3 5 10"/><path d="M12 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
  </svg>
);

export default RecipeGenerator;
