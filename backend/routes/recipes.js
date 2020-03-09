const express = require("express");

const RecipesController = require("../controllers/recipes");
// const Recipe = require('../models/recipe');
const checkAuth = require('../middleware/check-auth');
// const extractFile = require('../middleware/file');

const router = express.Router();

router.get("", RecipesController.getRecipes);
router.post("/create", checkAuth, RecipesController.createRecipe);
router.put("/:id", checkAuth, RecipesController.updateRecipe);
router.delete("/:id", checkAuth, RecipesController.deleteRecipe);

module.exports = router;
