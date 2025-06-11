const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
  updateTodoText, // ✅ New controller
} = require("../controllers/todoController");

router.use(auth);

router.get("/", getTodos);
router.post("/", addTodo);
router.put("/:id/update", updateTodoText);
router.put("/:id", toggleTodo); // still used for toggle

router.delete("/:id", deleteTodo);

module.exports = router;
