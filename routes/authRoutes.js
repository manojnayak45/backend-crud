const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  refresh,
  logout,
} = require("../controllers/authController");

const verifyAccessToken = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/refresh", refresh);
router.post("/logout", logout); // ✅ import from controller

router.get("/profile", verifyAccessToken, (req, res) => {
  if (req.user) {
    res.json({ name: req.user.name, email: req.user.email });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = router;
