const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const userDetailsRoutes = require("./routes/userDetailsRoutes");

const app = express();
app.use(
  cors({
    origin: "https://frontend-usercrud.vercel.app", // ✅ Must match frontend
    credentials: true, // ✅ Allows cookies
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/userdetails", userDetailsRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
