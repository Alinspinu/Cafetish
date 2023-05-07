const express = require("express");
const router = express.Router();
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage })

const { isLoggedIn, isAdmin } = require('../middleware')
const recipeControlers = require('../controlers/recipes')

router.route('/').get(isAdmin, recipeControlers.renderSearchRecipes)
router.route('/add')
    .get(isAdmin, recipeControlers.renderAddRecipe)
    .post(isAdmin, upload.single('recipe-image'), recipeControlers.createRecipe)
router.route('/:id')
    .get(isAdmin, recipeControlers.renderRecipeShow)
    .delete(isAdmin, recipeControlers.deleteRecepie)
    .putisAdmin, (recipeControlers.editRecipe)
router.route('/:id/edit')
    .get(isAdmin, recipeControlers.renderEditRecipe)


module.exports = router