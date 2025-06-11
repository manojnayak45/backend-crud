const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Environment check for production
const isProd = process.env.NODE_ENV === "production";

// Cookie settings for secure cross-origin requests
const cookieOptions = {
  httpOnly: true,
  secure: isProd, // true in production
  sameSite: isProd ? "None" : "Lax", // for cross-origin cookies
  path: "/", // Always set path
};

// Generate access and refresh tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// ✅ Signup Controller
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ username, email, password });
  res.status(201).json({ message: "User created successfully" });
};

// ✅ Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const { accessToken, refreshToken } = generateTokens(user);

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.status(200).json({ message: "Logged in successfully", user });
};

// ✅ Refresh Token Controller
exports.refresh = (req, res) => {
  console.log("🔥 Refresh hit");
  console.log("🔥 Cookies received:", req.cookies);

  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    console.log("🚫 No refresh token");
    return res.sendStatus(401);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("❌ Invalid refresh token:", err.message);
      res.clearCookie("refreshToken", cookieOptions);
      res.clearCookie("accessToken", cookieOptions);
      return res.sendStatus(403);
    }

    const { id } = user;
    const newAccessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed" });
  });
};

// ✅ Logout Controller
exports.logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false, // or true if using HTTPS
    sameSite: "Lax",
    path: "/", // important: match how you originally set the cookie
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false, // or true if using HTTPS
    sameSite: "Lax",
    path: "/",
  });

  res.json({ message: "Logged out successfully" });
};
