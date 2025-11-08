// src/components/TaskList.jsx
import React from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onUpdate, onDelete }) {
  if (!tasks || tasks.length === 0) return <p>No tasks yet.</p>;
  return (
    <div className="task-list">
      {tasks.map((t) => (
        <TaskItem key={t.id ?? t._id ?? t.id} task={t} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  );
}
