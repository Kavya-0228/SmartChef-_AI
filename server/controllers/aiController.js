const groqService = require('../services/groqService');

const generateRecipe = async (req, res) => {
    try {
        const { ingredients, diet, cuisine, spice_level } = req.body;

        if (!ingredients) {
            return res.status(400).json({ error: 'Ingredients are required' });
        }

        const recipe = await groqService.getRecipe({ ingredients, diet, cuisine, spice_level });
        res.json(recipe);
    } catch (error) {
        console.error('Error generating recipe:', error.message);
        res.status(500).json({ error: 'Failed to generate recipe' });
    }
};

const generateMealPlan = async (req, res) => {
    try {
        const { goal, budget, days } = req.body;

        if (!goal || !days) {
            return res.status(400).json({ error: 'Goal and days are required' });
        }

        const mealPlan = await groqService.getMealPlan({ goal, budget, days });
        res.json(mealPlan);
    } catch (error) {
        console.error('Error generating meal plan:', error.message);
        res.status(500).json({ error: 'Failed to generate meal plan' });
    }
};

const chat = async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const reply = await groqService.getChatReply(message, context);
        res.json({ reply });
    } catch (error) {
        console.error('Error in chat:', error.message);
        res.status(500).json({ error: 'Failed to handle chat' });
    }
};

module.exports = {
    generateRecipe,
    generateMealPlan,
    chat,
};
