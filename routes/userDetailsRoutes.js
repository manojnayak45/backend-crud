const express = require("express");
const router = express.Router();
const UserDetails = require("../models/UserDetails");
const verifyAccessToken = require("../middleware/auth");

// Add user detail
router.post("/", verifyAccessToken, async (req, res) => {
  try {
    const detail = new UserDetails({
      ...req.body,
      userId: req.user.id, // associate with current logged-in user
    });
    await detail.save();
    res.json(detail);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get user details for logged-in user
router.get("/", verifyAccessToken, async (req, res) => {
  try {
    const users = await UserDetails.find({ userId: req.user.id });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user data" });
  }
});

// Get user by ID (no change)
router.get("/:id", verifyAccessToken, async (req, res) => {
  try {
    const user = await UserDetails.findById(req.params.id);
    if (!user || user.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: "User not found" });
  }
});

// Update user detail
router.put("/:id", verifyAccessToken, async (req, res) => {
  try {
    const user = await UserDetails.findById(req.params.id);
    if (!user || user.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updated = await UserDetails.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete user detail
router.delete("/:id", verifyAccessToken, async (req, res) => {
  try {
    const user = await UserDetails.findById(req.params.id);
    if (!user || user.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await UserDetails.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
