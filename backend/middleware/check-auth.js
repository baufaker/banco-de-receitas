const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "secret_jwt_banco_de_receitas_dindin");
    // posso usar o código abaixo para extrair informação do token e adicionar no objeto req que continuará para os controllers. Lá nos controllers, posso extrair essa informação e usar para algo. Como não usarei, comentei o código.
    // req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch(error) {
    res.status(401).json({ message: "You are not authenticated to access this page!" });
  }
}
