const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const { createToDo } = require("./types");
const { updateToDo } = require("./types");

const app = express();
const port = 5000;
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

dotenv.config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.post("/todo", async (req, res) => {
  console.log("Received body:", req.body);
  const createPayload = req.body;
  const parsedPayload = createToDo.safeParse(createPayload);
  console.log(parsedPayload);
  if (!parsedPayload.success) {
    res.status(411).json({
      msg: "wrong inputs",
    });
    return;
  }
  //store in db logic
  const { title } = parsedPayload.data;
  try {
    const result = await pool.query(
      "INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *",
      [title, false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      msg: "Database error",
    });
  }
});

app.get("/todos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos ORDER BY id ASC");
    console.log(result);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({
      msg: "Database error",
    });
  }
});

app.delete("/todos/completed", async (req, res) => {
  try {
    const result = await pool.query(
      "Delete from todos Where completed = true Returning *"
    );
    res.status(200).json(result.rowCount);
  } catch (error) {
    res.status(500).json({
      msg: "Database error",
    });
  }
});

app.delete("/todos", async (req, res) => {
  try {
    const result = await pool.query("Delete from todos Returning *");
    res.status(200).json(result.rowCount);
  } catch (error) {
    res.status(500).json({
      msg: "Database error",
    });
  }
});

app.put("/completed", async (req, res) => {
  // const updatePayload = req.body;
  // const parsedPayload = updateToDo.safeParse(updatePayload);
  // if (!parsedPayload.success) {
  //   res.status(411).json({
  //     msg: "wrong inputs",
  //   });
  //   return;
  // }
  // const { id } = parsedPayload.data;
  const { id } = req.body;
  try {
    const statusResult = await pool.query(
      "SELECT completed FROM todos WHERE id = $1",
      [id]
    );

    if (statusResult.rows.length === 0) {
      res.status(404).json({
        msg: "To-do item not found",
      });
      return;
    }

    const { completed } = statusResult.rows[0];
    const newCompletedStatus = !completed;

    const result = await pool.query(
      "UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *",
      [newCompletedStatus, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        msg: "To-do item not found",
      });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    console.error("Error updating database:", err);
    res.status(500).json({
      msg: "Database error",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
