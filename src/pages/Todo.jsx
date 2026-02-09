import { useEffect, useState } from "react";
import api from "../api/api";   // ✅ FIXED

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // LOAD TASKS
  const loadTasks = async () => {
    try {
      const res = await api.get("tasks/", { headers });
      setTasks(res.data);
    } catch {
      alert("Session expired. Please login again.");
      logout();
    }
  };

  // ADD TASK
  const addTask = async () => {
    if (!title.trim()) {
      alert("Task title cannot be empty");
      return;
    }

    await api.post(
      "tasks/",
      { title: title.trim(), completed: false },
      { headers }
    );

    setTitle("");
    loadTasks();
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    await api.delete(`tasks/${id}/`, { headers });
    loadTasks();
  };

  // UPDATE TASK
  const updateTask = async (id) => {
    if (!editTitle.trim()) return;

    await api.put(
      `tasks/${id}/`,
      { title: editTitle.trim() },
      { headers }
    );

    setEditingId(null);
    setEditTitle("");
    loadTasks();
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  useEffect(() => {
    if (token) {
      loadTasks();
    } else {
      logout();
    }
  }, []);

  return (
    <div className="app-container">
      <div className="todo-header">
        <h2>Todo Dashboard</h2>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="todo-input">
        <input
          placeholder="New task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {editingId === task.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <button onClick={() => updateTask(task.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{task.title}</span>
                <div style={{ display: "flex", gap: "5px" }}>
                  <button
                    onClick={() => {
                      setEditingId(task.id);
                      setEditTitle(task.title);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    style={{ background: "#e53e3e" }}
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
