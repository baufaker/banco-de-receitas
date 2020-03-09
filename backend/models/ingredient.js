const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
  name: {type: String, required: true}
});

// turn the above definition into an object. Creating the model:
module.exports = mongoose.model('Ingredient', ingredientSchema);
