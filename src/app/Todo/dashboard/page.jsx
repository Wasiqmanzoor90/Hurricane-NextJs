"use client";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";

function Page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) setUserId(id);
    else setLoading(false);
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch(`/api/todo/getTodo?userId=${userId}`);
        const data = await res.json();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
        setError("Failed to load todos.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchTodos();
  }, [userId]);

  const createTodo = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const formData = {
        title,
        description,
        user: userId,
        completed: false,
      };

      const res = await fetch("/api/todo/todoCreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setTitle("");
      setDescription("");
      setTodos((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const toggleComplete = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/todo/updateTodo?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update todo");

      const updatedRes = await res.json();
      console.log("Response from updateTodo API:", updatedRes);

      // Because backend returns { status, message, data }, we pick updatedTodo from data
      const updatedTodo = updatedRes.data;

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, completed: updatedTodo.completed } : todo
        )
      );
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f0f2f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 600,
          p: 4,
          borderRadius: 3,
          bgcolor: "#ffffff",
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
        >
          Create a Todo
        </Typography>

        <Box component="form" onSubmit={createTodo}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            sx={{ mb: 2 }}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ py: 1, fontWeight: "bold", borderRadius: 2 }}
          >
            Submit
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Your Todos
        </Typography>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : todos.length === 0 ? (
          <Typography>No todos found.</Typography>
        ) : (
          <Box component="ul" sx={{ pl: 2 }}>
            {todos.map((todo) => (
              <li
                key={todo?._id}
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="checkbox"
                  checked={!!todo?.completed}
                  onChange={() => {
                    if (todo?._id && typeof todo.completed === "boolean") {
                      toggleComplete(todo._id, !todo.completed);
                    }
                  }}
                  style={{ marginRight: "10px" }}
                />
                <div>
                  <strong>{todo?.title}</strong>: {todo?.description} -{" "}
                  <span style={{ color: todo?.completed ? "green" : "red" }}>
                    {todo?.completed ? "Completed" : "Incomplete"}
                  </span>
                </div>
              </li>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default Page;
