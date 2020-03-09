const express = require("express");

const UsersController = require('../controllers/users');

const router = express.Router();

// UserController.createUser é uma referência pro código a ser executado.
router.post("/signup", UsersController.createUser);

router.post("/login", UsersController.userLogin);

module.exports = router;
