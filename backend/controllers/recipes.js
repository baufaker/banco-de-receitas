const Recipe = require('../models/recipe');

exports.getRecipes = (req, res, next) => {
  let fetchedRecipes;
  let query = Recipe.find()
  .then((recipes) => {
    fetchedRecipes = recipes;
    res.status(200).json({
      message: 'Recipes Fetched successfully',
      recipes: fetchedRecipes
    });
  });
}

exports.createRecipe = (req, res, next) => {
  // construindo a url para acessar o host em que estamos guardando as imagens
  const url = req.protocol + '://' + req.get("host");
  const recipe = new Recipe({
    title: req.body.title,
    description: req.body.description,
    ingredients: req.body.ingredients,
    typeOfRecipe: req.body.typeOfRecipe,
    restrictions: req.body.restrictions,
    fromWhere: req.body.fromWhere,
    imagePath: req.body.imagePath
  });

  recipe.save()
    .then(
      createdRecipe => {
        console.log(createdRecipe);
        res.status(200).json({
          message: 'created recipe successfuly',
          recipe: recipe
        });
      }
    );

  // ingredient.save().then(createdIngredient => {
  //   // console.log(createdPost);
  //   res.status(201).json({
  //     message: "ingredient added successfully",
  //     ingredient: {
  //       // essa reticencia cria aqui uma cópia de todas as propriedades do objeto copiado
  //       // é chamada de "spread operator"
  //       ...createdIngredient
  //     }
  //   });
  // })
  // .catch(error => {
  //   res.status(500).json({
  //     message: "Creating an ingredient failed"
  //   });
  // });

}

exports.updateRecipe = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const recipe = new Recipe({
    _id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    ingredients: req.body.ingredients,
    typeOfRecipe: req.body.typeOfRecipe,
    restrictions: req.body.restrictions,
    fromWhere: req.body.fromWhere,
    imagePath: req.body.imagePath
  });

  Recipe.updateOne({_id: req.params.id}, recipe)
    .then(
      (result) => {
        if(result.n > 0){
          res.status(200).json({
            message: "update recipe successfull!"
          });
        }
      }
    )
    .catch(error => {
      res.status(500).json({
        message: "Updating recipe failed"
      });
    });
}

exports.deleteRecipe = (req, res, next) => {
  console.log('chegou aqui no deleteIngredient do backend');
  Recipe.deleteOne({_id: req.params.id}, (err, result)=>{
    if(err){
      res.status(500).json({
        message: "Error deleting recipes on app."
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
      message: "Deleting Recipe failed"
    })
  });
}
