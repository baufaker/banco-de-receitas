const express = require("express");

const IngredientsController = require("../controllers/ingredients");
// const Ingredient = require('../models/ingredient');
const checkAuth = require('../middleware/check-auth');
// const extractFile = require('../middleware/file');

const router = express.Router();

router.post("/create", checkAuth, IngredientsController.createIngredient);
router.put("/:id", checkAuth, IngredientsController.updateIngredient);
router.delete("/:id", checkAuth, IngredientsController.deleteIngredient);
router.get("", IngredientsController.getIngredients);

module.exports = router;
