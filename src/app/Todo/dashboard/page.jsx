"use client";
import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, Paper, Divider } from "@mui/material";

function Page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // store userId in state

  // Load userId from localStorage on client
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) {
      setUserId(id);
    } else {
      console.warn("No userId found in localStorage.");
      setLoading(false);
    }
  }, []);

  // Fetch todos only after userId is available
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch(`/api/todo/getTodo?userId=${userId}`);
        const data = await res.json();
        console.log("Fetched todos:", data);
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTodos();
    }
  }, [userId]);

  // Handle new todo creation
  const createTodo = async (e) => {
    e.preventDefault();
    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    try {
      const formData = { title, description, user: userId, completed: false };
      const res = await fetch("/api/todo/todoCreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setTitle("");
      setDescription("");
      setTodos((prev) => [...prev, data]); // Add new todo without refetch
    } catch (error) {
      console.error("Error creating todo:", error);
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
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
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
              <li key={todo._id}>
                <strong>{todo.title}</strong>: {todo.description} -{" "}
                <span style={{ color: todo.completed ? "green" : "red" }}>
                  {todo.completed ? "Completed" : "Incomplete"}
                </span>
              </li>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default Page;
