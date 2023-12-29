const jwt = require("jsonwebtoken");
let SECRET_KEY = process.env.SECRET_KEY || "random_secret_key1234";

module.exports = function (role) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      const token = req.headers.authorization.split(" ")[1]; // barer
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const decoded = jwt.verify(token, SECRET_KEY);
      if (decoded.role !== role) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      req.user = decoded;
      next();
    } catch (e) {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
};
