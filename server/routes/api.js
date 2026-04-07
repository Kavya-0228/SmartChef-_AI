const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/generate-recipe', aiController.generateRecipe);
router.post('/generate-meal-plan', aiController.generateMealPlan);
router.post('/chat', aiController.chat);

module.exports = router;
