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
  Snackbar,
  Alert,
  Fade,
} from "@mui/material";
import NavbarComponent from "@/component/navbar/page";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useRouter } from "next/navigation";
import isAuthorised from "../../../../utils/isAuthorised";
import LoadingPage from "@/component/loading/page";

function Page() {
  // State hooks
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("User");
  const [loadingTodos, setLoadingTodos] = useState(true);
  const [feedback, setFeedback] = useState({ open: false, message: "", severity: "success" });

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
    if (!id) setLoading(false);
  }, []);

  // Fetch todos once userId is available
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch(`/api/todo/getTodo?userId=${userId}`);
        const data = await res.json();
        setTodos(data);
      } catch (error) {
        setFeedback({ open: true, message: "Failed to load todos.", severity: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchTodos();
  }, [userId]);

  // Show loading while checking auth
  if (loadingTodos) {
    return <LoadingPage />;
  }

  // Create a new todo
  const createTodo = async (e) => {
    e.preventDefault();
    if (!userId) {
      setFeedback({ open: true, message: "User not found. Please login again.", severity: "error" });
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

      if (!res.ok) throw new Error("Failed to create todo");

      const data = await res.json();
      setTitle("");
      setDescription("");
      setTodos((prev) => [...prev, data]);
      setFeedback({ open: true, message: "Todo added!", severity: "success" });
    } catch (error) {
      setFeedback({ open: true, message: "Failed to create todo.", severity: "error" });
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
      setFeedback({
        open: true,
        message: newStatus ? "Marked as completed!" : "Marked as incomplete!",
        severity: "success",
      });
    } catch (err) {
      setFeedback({ open: true, message: "Failed to update todo.", severity: "error" });
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
        setFeedback({ open: true, message: data.message || "Failed to delete todo.", severity: "error" });
        return;
      }
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      setFeedback({ open: true, message: "Todo deleted.", severity: "success" });
    } catch (error) {
      setFeedback({ open: true, message: "An error occurred while deleting the todo.", severity: "error" });
    }
  };

  return (
    <>
      <NavbarComponent />
      <Fade in timeout={700}>
        <Typography
          variant="h4"
          sx={{
            mt: 2,
            mb: 3,
            fontWeight: "bold",
            letterSpacing: 1,
            color: "primary.main",
            textAlign: "center",
            textShadow: "0 2px 12px #e3f2fd",
          }}
        >
          Welcome, {name}!
        </Typography>
      </Fade>

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
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: 410,
            p: { xs: 2, sm: 4 },
            borderRadius: 4,
            background: "rgba(255,255,255,0.96)",
            boxShadow: "0 8px 32px rgba(25, 118, 210, 0.09)",
          }}
        >
          {/* Todo Creation Form */}
          <Box
            component="form"
            onSubmit={createTodo}
            sx={{
              mb: 3,
              background: "#f5f7fa",
              borderRadius: 3,
              p: 2,
              boxShadow: "0 0 8px #e3f2fd",
            }}
          >
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
              required
              InputProps={{ sx: { borderRadius: 2 } }}
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
              InputProps={{ sx: { borderRadius: 2 } }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                py: 1.2,
                fontWeight: "bold",
                borderRadius: 2,
                fontSize: "1.1rem",
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.09)",
                letterSpacing: 0.5,
              }}
            >
              Add Todo
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Todo List */}
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: "bold",
              letterSpacing: 0.5,
              color: "primary.main",
              textAlign: "center",
            }}
          >
            Your Todos
          </Typography>

          {loading ? (
            <Typography align="center" color="text.secondary">
              Loading...
            </Typography>
          ) : todos.length === 0 ? (
            <Typography align="center" color="text.secondary">
              No todos found.
            </Typography>
          ) : (
            <Box component="ul" sx={{ pl: 0, listStyle: "none", m: 0 }}>
              {todos
                .slice()
                .reverse()
                .map((todo) => (
                  <Fade in key={todo?._id} timeout={350}>
                    <li
                      style={{
                        marginBottom: "14px",
                        padding: "16px 12px 10px 12px",
                        borderRadius: "14px",
                        backgroundColor: "#f9fafd",
                        borderLeft: `6px solid ${todo.completed ? "#4caf50" : "#f44336"}`,
                        boxShadow: "0 1px 4px rgba(33,150,243,0.07)",
                        position: "relative",
                        transition: "background 0.3s",
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
                              onClick={() => toggleComplete(todo._id, !todo.completed)}
                              sx={{
                                color: todo.completed ? "#4caf50" : "#b0b0b0",
                                mt: "4px",
                                mr: "12px",
                                transition: "color 0.2s",
                              }}
                              size="large"
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
                                fontSize: "1.08rem",
                                textDecoration: todo.completed ? "line-through" : "none",
                              }}
                            >
                              {todo.title}
                            </Typography>
                            <Typography sx={{ color: "#555", fontSize: "0.98rem", opacity: 0.93 }}>
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
                        <div style={{ textAlign: "right", minWidth: 64 }}>
                          <Tooltip title="Delete Todo">
                            <IconButton
                              aria-label="delete"
                              color="error"
                              onClick={() => removeTodo(todo._id)}
                              size="medium"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              fontSize: "0.75rem",
                              color: "#888",
                              mt: 0.5,
                              textAlign: "right",
                            }}
                          >
                            {todo.createdAt
                              ? new Date(todo.createdAt).toLocaleDateString()
                              : ""}
                          </Typography>
                        </div>
                      </div>
                    </li>
                  </Fade>
                ))}
            </Box>
          )}
        </Paper>
      </Box>
      <Snackbar
        open={feedback.open}
        autoHideDuration={2000}
        onClose={() => setFeedback((f) => ({ ...f, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setFeedback((f) => ({ ...f, open: false }))}
          severity={feedback.severity}
          variant="filled"
          sx={{ width: "100%", fontWeight: 500 }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Page;