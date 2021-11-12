const jwt = require("jsonwebtoken");

const authmiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token" });
  }
  try {
    const decoded = jwt.verify(token, "jwtSecret");
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "토큰이 유요하지않습니다." });
  }
};

module.exports = authmiddleware;
