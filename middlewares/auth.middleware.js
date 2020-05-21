const jwt = require("jsonwebtoken");

let verifyToken = (req, res, next) => {
        let token = req.headers["x-access-token"];

        if (!token) {
            return res.status(403).send({
                message: "No token provided!"
            });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, result) => {
          if (err) {
              return res.status(401).send({
              message: "Unauthorized!"
            });
          }
          next();
        });
};

const authJwt = {
  verifyToken: verifyToken,
};

module.exports = authJwt;
