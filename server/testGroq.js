require('dotenv').config();
const groqService = require('./services/groqService');

async function testGroq() {
    console.log("Testing Groq API connection...");
    try {
        const recipe = await groqService.getRecipe({ 
            ingredients: "chicken, rice", 
            diet: "none", 
            cuisine: "any", 
            spice_level: "mild" 
        });
        console.log("\nSuccess!! Received JSON recipe:", recipe.dish_name);
    } catch (e) {
        console.error("\nERROR DETAILS:");
        if (e.response && e.response.data) {
            console.error(JSON.stringify(e.response.data, null, 2));
        } else {
            console.error(e.message);
        }
    }
}
testGroq();
