"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import NavbarComponent from "@/component/navbar/page";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useRouter } from "next/navigation";
import isAuthorised from "../../../../utils/isAuthorised";
import LoadingPage from "@/component/loading/page";

function Page() {
  // Local state declarations - ALL HOOKS MUST BE DECLARED FIRST
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("User");

  const [loadingTodos, setLoadingTodos] = useState(true); // Fixed typo: loaingtodos -> loadingTodos

  const router = useRouter();

  // Authorization check effect
  useEffect(() => {
    (async () => {
      const verify = await isAuthorised();
      if (!verify) {
        router.push("/");
      } else {
        setLoadingTodos(false);
      }
    })();
  }, []);

  // Load userId and name from localStorage on initial mount
  useEffect(() => {
    const id = localStorage.getItem("userId");
    const storedName = localStorage.getItem("name");
    if (id) setUserId(id);
    if (storedName) setName(storedName);
    if (!id) setLoading(false); // Avoid loading if user ID is missing
  }, []);

  // Fetch todos once userId is available
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

  // CONDITIONAL RENDERING AFTER ALL HOOKS
  if (loadingTodos) {
    return <LoadingPage />;
  }

  // Create a new todo
  const createTodo = async (e) => {
    e.preventDefault();
    console.log("Submitting Todo..."); // ✅ Add this line
    if (!userId) {
      console.warn("🚫 No userId found. Aborting createTodo.");
      return;
    }

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

  // Toggle the completion status of a todo
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

  // Delete a todo
  const removeTodo = async (id) => {
    try {
      const res = await fetch(`/api/todo/deleteTodo?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log("Error deleting todo:", data.message);
        return;
      }
      console.log("Todo deleted successfully:", data.message);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("An error occurred while deleting the todo:", error);
    }
  };

  return (
    <>
      <NavbarComponent />
      <Typography variant="h4" sx={{ mt: 2, mb: 3, fontWeight: "bold" }}>
        Welcome {name}!
      </Typography>

      <Box
        sx={{
          minHeight: "60vh",
          bgcolor: "white",
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
            maxWidth: 350,
            p: 3,
            borderRadius: 3,
          }}
        >
          {/* Todo Creation Form */}
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

          {/* Todo List */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Your Todos
          </Typography>

          {loading ? (
            <Typography>Loading...</Typography>
          ) : todos.length === 0 ? (
            <Typography>No todos found.</Typography>
          ) : (
            <Box component="ul" sx={{ pl: 0, listStyle: "none", m: 0 }}>
              {todos.map((todo) => (
                <li
                  key={todo?._id}
                  style={{
                    marginBottom: "10px",
                    padding: "12px",
                    borderRadius: "10px",
                    backgroundColor: "#f9f9f9",
                    borderLeft: `6px solid ${todo.completed ? "#4caf50" : "#f44336"}`,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", flex: 1 }}>
                      <Tooltip
                        title={todo.completed ? "Mark as Incomplete" : "Mark as Complete"}
                      >
                        <IconButton
                          onClick={() =>
                            toggleComplete(todo._id, !todo.completed)
                          }
                          sx={{
                            color: todo.completed ? "green" : "gray",
                            mt: "4px",
                            mr: "10px",
                          }}
                        >
                          {todo.completed ? (
                            <CheckCircleOutlineIcon />
                          ) : (
                            <RadioButtonUncheckedIcon />
                          )}
                        </IconButton>
                      </Tooltip>

                      <div>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: "1rem",
                            textDecoration: todo.completed ? "line-through" : "none",
                          }}
                        >
                          {todo.title}
                        </Typography>
                        <Typography sx={{ color: "#555", fontSize: "0.9rem" }}>
                          {todo.description}
                        </Typography>
                        <Typography
                          sx={{
                            color: todo.completed ? "#4caf50" : "#f44336",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            mt: 0.5,
                          }}
                        >
                          {todo.completed ? "Completed" : "Incomplete"}
                        </Typography>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <div style={{ textAlign: "right" }}>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => removeTodo(todo._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <Typography
                        variant="caption"
                        sx={{ display: "block", fontSize: "0.75rem", color: "#888" }}
                      >
                        {new Date(todo.createdAt).toLocaleDateString()}
                      </Typography>
                    </div>
                  </div>
                </li>
              ))}
            </Box>
          )}
        </Paper>
      </Box>
    </>
  );
}

export default Page;