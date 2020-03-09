const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const Ingredient = require('./models/ingredient');

const ingredientRoutes = require("./routes/ingredients");
const recipeRoutes = require("./routes/recipes");
const userRoutes = require("./routes/users");

var dbURI = 'mongodb://localhost:27017/banco-de-receitas';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//connecting to mongodb via mongoose
mongoose.connect(dbURI)
  .then(() => {
    console.log('Yay!! Connected to database!!');
  })
  .catch(() => {
    console.log('Connection to database Failed!');
  });

// estes dois middlewares já chamam a função next() para executar os próximos middlewares
// este primeiro middleware cria a variável "body" dentro dos requests (req)
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use("/images", express.static(path.join("images")))

// Setando Headers para lidar com o CORS Error. Se não setar estes headers, nenhuma URL conseguirá acessar esta API
app.use((req, res, next) => {
  // Deixando claro quais domínios podem acessar o resultado da API (no caso, todos)
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Deixando claro quais operações (fornecidas no header da requisição) podem ser realizadas para acessar o resultado da API
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  // Deixando claro quais métodos HTTP podem ser usados neste servidor
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  // chama o próximo middleware
  next();
});


// Todas as rotas no servidor que estiverem sob a URL /api/posts serão tratadas pelo postRoutes
// app.use("/api/posts", postRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
