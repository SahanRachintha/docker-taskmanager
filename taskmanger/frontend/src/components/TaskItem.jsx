// src/components/TaskItem.jsx
import React, { useState } from "react";
import TaskForm from "./TaskForm";

export default function TaskItem({ task, onUpdate, onDelete }) {
  const id = task.id ?? task._id ?? task.taskId;
  const [editing, setEditing] = useState(false);

  const toggleDone = () => {
    onUpdate(id, { ...task, done: !task.done });
  };

  const saveEdit = (updates) => {
    onUpdate(id, { ...task, ...updates });
    setEditing(false);
  };

  return (
    <div className={`task-item ${task.done ? "done" : ""}`}>
      {!editing ? (
        <>
          <div className="task-main">
            <input
              type="checkbox"
              checked={!!task.done}
              onChange={toggleDone}
            />
            <div className="task-text">
              <strong>{task.title}</strong>
              {task.description && <div className="desc">{task.description}</div>}
            </div>
          </div>

          <div className="task-actions">
            <button onClick={() => setEditing(true)}>Edit</button>
            <button onClick={() => onDelete(id)} className="danger">Delete</button>
          </div>
        </>
      ) : (
        <TaskForm initial={task} onSubmit={saveEdit} onCancel={() => setEditing(false)} />
      )}
    </div>
  );
}
