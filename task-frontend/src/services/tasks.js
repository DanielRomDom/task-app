const API = "https://task-app-59x9.onrender.com/tasks";

export const getTasks = async () => {
  const res = await fetch(API);
  return res.json();
};

export const createTask = async (titulo) => {
  return fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo }),
  });
};

export const deleteTask = async (id) => {
  return fetch(`${API}/${id}`, { method: "DELETE" });
};

export const toggleTask = async (task) => {
  const res = await fetch(`${API}/${task._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completada: !task.completada }),
  });

  return res.json();
};

export const updateTask = async (id, titulo) => {
  return fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo }),
  });
};