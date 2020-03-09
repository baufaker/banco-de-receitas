const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  // in node.js, we use String. In angular, string
  title: {type: String, required: true},
  description: {type: String, required: true},
  ingredients: {type: [{ingredient_id: String, measure: String, amount: Number, ingredient_mode: String}], required: true},
  typeOfRecipe: {type: String, required: true},
  restrictions: {type: {vegan: Boolean, glutenFree: Boolean, noMilk: Boolean}},
  fromWhere: {type: String, required: true},
  imagePath: {type: String},
});

// turn the above definition into an object. Creating the model:
module.exports = mongoose.model('Recipe', postSchema);
