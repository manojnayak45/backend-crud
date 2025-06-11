const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("❌ Access token error:", err.message);
      return res.sendStatus(403); // invalid/expired token
    }
    req.user = user; // token payload
    next();
  });
};

module.exports = verifyAccessToken;
