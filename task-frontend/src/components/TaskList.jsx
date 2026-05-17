import TaskItem from "./TaskItem";

function TaskList({ tasks, onEdit, onToggle, onDelete }) {
  return (
    <ul>
      {tasks.map((t) => (
        <TaskItem
          key={t._id}
          task={t}
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TaskList;