import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChefHat, Calendar, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4 py-12 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-accent-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob" style={{ animationDelay: '4s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 max-w-3xl"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Cook Smarter with <span className="text-gradient">SmartChef AI</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
          Transform your ingredients into culinary masterpieces. Get personalized recipes, detailed nutritional insights, and structured meal plans powered by advanced AI.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/recipe">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary-500 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-primary-500/30 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <ChefHat className="w-6 h-6" />
              Generate Recipe
            </motion.button>
          </Link>
          <Link to="/planner">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-bold text-lg shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Calendar className="w-6 h-6" />
              Plan Meals
            </motion.button>
          </Link>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 z-10 w-full max-w-5xl"
      >
        {[
          { title: 'Ingredient Based', desc: 'Type in what you have in the fridge, and we do the magic.', icon: <Sparkles className="w-8 h-8 text-primary-500" /> },
          { title: 'Nutritional Focus', desc: 'Detailed macros and health benefits for every recipe.', icon: <ChefHat className="w-8 h-8 text-accent-500" /> },
          { title: 'Smart Chatbot', desc: 'Ask about substitution, tips, and cooking doubts 24/7.', icon: <Sparkles className="w-8 h-8 text-blue-500" /> }
        ].map((feature, idx) => (
          <div key={idx} className="glass dark:glass-dark p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-full shadow-md">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-500 dark:text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;
