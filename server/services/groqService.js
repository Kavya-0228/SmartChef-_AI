const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

const createAxiosInstance = () => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error('GROQ_API_KEY is not defined in environment variables');
    }

    return axios.create({
        baseURL: GROQ_API_URL,
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });
};

const getRecipe = async ({ ingredients, diet, cuisine, spice_level }) => {
    const systemPrompt = `You are a professional chef and certified nutritionist.
Generate realistic recipes using only provided ingredients.
Return clean JSON only without any markdown formatting or backticks around it.
Provide approximate nutrition values.
Include health benefits and dietary suitability.
Do not include explanations outside JSON.
Expected JSON format:
{
  "dish_name": "string",
  "ingredients": ["string"],
  "cooking_steps": ["string"],
  "cooking_time": "string",
  "calories": number,
  "protein": "string",
  "carbs": "string",
  "fat": "string",
  "vitamins": ["string"],
  "minerals": ["string"],
  "health_benefits": ["string"],
  "suitable_for": ["string"],
  "avoid_if": ["string"],
  "meal_type": "string"
}`;

    let userPrompt = `Ingredients: ${ingredients}`;
    if (diet) userPrompt += `\nDiet preference: ${diet}`;
    if (cuisine) userPrompt += `\nCuisine type: ${cuisine}`;
    if (spice_level) userPrompt += `\nSpice level: ${spice_level}`;

    const axiosInstance = createAxiosInstance();

    const response = await axiosInstance.post('', {
        model: MODEL,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
    });

    const content = response.data.choices[0].message.content;
    try {
        return JSON.parse(content);
    } catch (e) {
        throw new Error('Failed to parse AI response as JSON');
    }
};

const getMealPlan = async ({ goal, budget, days }) => {
    const systemPrompt = `You are a professional nutritionist.
Generate a meal plan based on the goal, budget, and number of days.
Return clean JSON only without any markdown formatting.
Expected format:
{
  "days": [
    {
      "day": number,
      "meals": [
        { "type": "Breakfast", "dish": "string", "calories": number },
        { "type": "Lunch", "dish": "string", "calories": number },
        { "type": "Dinner", "dish": "string", "calories": number }
      ],
      "total_calories": number
    }
  ],
  "grocery_list": ["string"],
  "overall_budget_estimate": "string",
  "goal_suitability": "string"
}`;

    const userPrompt = `Goal: ${goal}\nBudget: ${budget}\nDays: ${days}`;

    const axiosInstance = createAxiosInstance();

    const response = await axiosInstance.post('', {
        model: MODEL,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
    });

    const content = response.data.choices[0].message.content;
    try {
        return JSON.parse(content);
    } catch (e) {
        throw new Error('Failed to parse AI response as JSON');
    }
};

const getChatReply = async (message, context) => {
    const systemPrompt = `You are an AI cooking and nutrition assistant named SmartChef. 
You provide friendly, accurate, and concise advice about cooking doubts, substitutions, budget recipes, and diet suggestions.
Respond directly to the user in a helpful tone.`;

    const axiosInstance = createAxiosInstance();
    
    let messages = [{ role: 'system', content: systemPrompt }];
    
    // Add some context history if provided
    if (context && Array.isArray(context)) {
        messages = messages.concat(context);
    }
    
    messages.push({ role: 'user', content: message });

    const response = await axiosInstance.post('', {
        model: MODEL,
        messages: messages,
        temperature: 0.7
    });

    return response.data.choices[0].message.content;
};

module.exports = {
    getRecipe,
    getMealPlan,
    getChatReply
};
