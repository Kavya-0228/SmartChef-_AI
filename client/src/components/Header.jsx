import React from 'react';
import { Moon, Sun, ChefHat } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full glass dark:glass-dark transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <ChefHat className="text-primary-500 w-8 h-8" />
          <span className="text-2xl font-bold text-gradient">SmartChef AI</span>
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/recipe" className="font-medium hover:text-primary-500 transition-colors">Recipe Generator</Link>
          <Link to="/planner" className="font-medium hover:text-primary-500 transition-colors">Meal Planner</Link>
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
