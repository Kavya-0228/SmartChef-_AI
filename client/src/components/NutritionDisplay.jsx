import React from 'react';
import { motion } from 'framer-motion';

const NutritionDisplay = ({ nutrition }) => {
  if (!nutrition) return null;

  const { calories, protein, carbs, fat, health_benefits, suitable_for, avoid_if } = nutrition;

  const parseValue = (val) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const match = val.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    }
    return 0;
  };

  const p = parseValue(protein);
  const c = parseValue(carbs);
  const f = parseValue(fat);
  const total = p + c + f || 1;

  const macros = [
    { label: 'Protein', value: protein, percent: (p / total) * 100, color: 'bg-blue-500' },
    { label: 'Carbs', value: carbs, percent: (c / total) * 100, color: 'bg-yellow-500' },
    { label: 'Fat', value: fat, percent: (f / total) * 100, color: 'bg-red-500' },
  ];

  return (
    <div className="mt-8 glass dark:glass-dark rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-4">Nutritional Overview</h3>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-3xl font-black text-primary-500">{calories}</span>
        <span className="text-gray-500 font-medium">kcal per serving</span>
      </div>

      <div className="space-y-4 mb-6">
        {macros.map((macro, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-sm mb-1 font-medium">
              <span>{macro.label}</span>
              <span>{macro.value}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${macro.percent}%` }}
                transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
                className={`h-2.5 rounded-full ${macro.color}`}
              ></motion.div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {health_benefits?.slice(0, 3).map((benefit, idx) => (
          <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-900 rounded-full text-xs font-semibold">
            {benefit}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {suitable_for?.length > 0 && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <h4 className="font-bold text-green-700 dark:text-green-400 mb-1">Great for</h4>
            <ul className="list-disc pl-4 text-green-600 dark:text-green-300">
              {suitable_for.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
        )}
        {avoid_if?.length > 0 && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <h4 className="font-bold text-red-700 dark:text-red-400 mb-1">Avoid if</h4>
            <ul className="list-disc pl-4 text-red-600 dark:text-red-300">
              {avoid_if.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionDisplay;
