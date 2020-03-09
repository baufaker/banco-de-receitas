const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      role: 'user'
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'invalid authentication credentials'
        });
      });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Wrong Username or Password"
        });
      }
      fetchedUser = user;

      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      // console.log('comparacao de senhas:', result);
      if (!result) {
        return res.status(401).json({
          message: "Wrong Username or Password"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secret_jwt_banco_de_receitas_dindin",
        { expiresIn: "1h" }
      );
      // console.log(
      //   'token: ', token
      // );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        userRole: fetchedUser.role
      });
    })
    .catch(err => {
      // console.log(err);
      return res.status(401).json({
        message: 'Auth failed for some reason'
      });
    });
}
