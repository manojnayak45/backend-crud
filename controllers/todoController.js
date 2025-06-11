const Todo = require("../models/Todo");

exports.getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user.id });
  res.json(todos);
};

exports.addTodo = async (req, res) => {
  const todo = await Todo.create({ text: req.body.text, user: req.user.id });
  res.status(201).json(todo);
};

exports.toggleTodo = async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.sendStatus(404);
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
};

exports.deleteTodo = async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

exports.updateTodoText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    todo.text = text;
    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
