const Ingredient = require('../models/ingredient');

exports.getIngredients = (req, res, next) => {
  let fetchedIngredients;
  let query = Ingredient.find()
  .then((ingredients) => {
    fetchedIngredients = ingredients;
    res.status(200).json({
      message: 'Ingredients Fetched successfully',
      ingredients: fetchedIngredients
    });
  });
}

exports.createIngredient = (req, res, next) => {
  // construindo a url para acessar o host em que estamos guardando as imagens
  const url = req.protocol + '://' + req.get("host");
  const ingredient = new Ingredient({
    name: req.body.name
  });
  ingredient.save().then(createdIngredient => {
    // console.log(createdPost);
    res.status(201).json({
      message: "ingredient added successfully",
      ingredient: {
        // essa reticencia cria aqui uma cópia de todas as propriedades do objeto copiado
        // é chamada de "spread operator"
        ...createdIngredient
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating an ingredient failed"
    });
  });
  // Neste caso, acabamos o middleware aqui. Não chamamos next() até porque já estamos enviando uma resposta res.status(201)
}

exports.updateIngredient = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const ingredient = new Ingredient({
    _id: req.params.id,
    name: req.body.name
  });

  Ingredient.updateOne({_id: req.params.id}, ingredient)
    .then(
      (result) => {
        if(result.n > 0){
          res.status(200).json({
            message: "update ingredient successfull!"
          });
        }
      }
    )
    .catch(error => {
      res.status(500).json({
        message: "Updating ingredient failed"
      });
    });
}

exports.deleteIngredient = (req, res, next) => {
  console.log('chegou aqui no deleteIngredient do backend');
  Ingredient.deleteOne({_id: req.params.id}, (err, result)=>{
    if(err){
      res.status(500).json({
        message: "Error deleting ingredients on app."
      });
    }
      // n é o valor no resultado da operação que indica quantos objetos foram mexidos no banco de dados (atualizados, deletados, etc)
    if(result.n > 0){
      res.status(200).json({
        message: "deletion successfull!"
      });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Deleting Ingredient failed"
    })
  });
}
