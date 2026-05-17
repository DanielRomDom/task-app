function TaskItem({ task, onEdit, onToggle, onDelete }) {

  return (
    <li className="task-item" data-id={task._id}>
      <span className={task.completada ? "completed" : ""}>
        {task.titulo}
      </span>

      <div className="buttons">
        <button className="edit-btn" onClick={() => onEdit(task)}>
          ✏️
        </button>

        <button
          className={task.completada ? "undo-btn" : "complete-btn"}
          onClick={() => onToggle(task)}
        >
          {task.completada ? "↩" : "✔"}
        </button>

        <button className="delete-btn" onClick={() => onDelete(task._id)}>
            🗑️
        </button>
      </div>
    </li>
  );
}

export default TaskItem;