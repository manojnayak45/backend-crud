const express = require("express");
const router = express.Router();
const UserDetails = require("../models/UserDetails");

// ✅ Add user
router.post("/", async (req, res) => {
  try {
    const detail = new UserDetails(req.body);
    await detail.save();
    res.json(detail);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get all users
router.get("/", async (req, res) => {
  const users = await UserDetails.find();
  res.json(users);
});

// ✅ Get single user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await UserDetails.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Update user
router.put("/:id", async (req, res) => {
  try {
    const updated = await UserDetails.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Delete user
router.delete("/:id", async (req, res) => {
  try {
    await UserDetails.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
