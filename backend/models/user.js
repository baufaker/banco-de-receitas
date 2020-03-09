const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type: String, required: true}
});

// plugins são usados para executar códigos dentro do schema.
userSchema.plugin(uniqueValidator);

// turn the above definition into an object. Creating the model:
module.exports = mongoose.model('User', userSchema);
