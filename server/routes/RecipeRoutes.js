const express = require('express');
const router = express.Router();
const RecipeController = require('../controllers/RecipeController');

/* app routes*/ 
router.get('/',RecipeController.homepage);  //Home page route 
router.get('/categories',RecipeController.exploreCategories) ;
router.post('/search', RecipeController.searchRecipe);
router.get('/submit-recipe', RecipeController.submitRecipe);
router.post('/submit-recipe', RecipeController.submitRecipeOnPost);

router.get('/RecipesPage/:id',RecipeController.recipesfinds);

module.exports =router;

 