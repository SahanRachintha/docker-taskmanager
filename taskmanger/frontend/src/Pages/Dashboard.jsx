import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import "./CSS/Dashboard.css";

const API_URL_TASKS = "http://backend:8080/api/tasks";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL_TASKS);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create task
  const createTask = async (task) => {
    try {
      const res = await fetch(API_URL_TASKS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Create task error:", data);
        throw new Error(data?.message || "Failed to create task");
      }

      await fetchTasks(); // refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  // Update task
  const updateTask = async (id, updatedTask) => {
    try {
      const res = await fetch(`${API_URL_TASKS}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Update task error:", data);
        throw new Error(data?.message || "Failed to update task");
      }

      await fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL_TASKS}/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Failed to delete task");

      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Logout
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <nav className="topbar">
        <h1>TaskManager</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <main className="dashboard-main">
        <section className="left">
          <h2>Add Task</h2>
          <TaskForm onSubmit={createTask} />
        </section>

        <section className="right">
          <h2>Tasks</h2>
          {error && <p className="error">{error}</p>}
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p>No tasks yet.</p>
          ) : (
            <TaskList tasks={tasks} onUpdate={updateTask} onDelete={deleteTask} />
          )}
        </section>
      </main>
    </div>
  );
}
