import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import RecipeGenerator from './pages/RecipeGenerator';
import MealPlanner from './pages/MealPlanner';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen relative">
          <Header />
          <main className="flex-1 pb-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recipe" element={<RecipeGenerator />} />
              <Route path="/planner" element={<MealPlanner />} />
            </Routes>
          </main>
          <Chatbot />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
