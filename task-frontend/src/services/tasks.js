const API = "https://task-app-59x9.onrender.com/tasks";

const authHeader = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const getTasks = async (token) => {
  const res = await fetch(API, {
    headers: authHeader(token),
  });
  return res.json();
};

export const createTask = async (titulo, token) => {
  return fetch(API, {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify({ titulo }),
  });
};

export const deleteTask = async (id, token) => {
  return fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: authHeader(token),
  });
};

export const toggleTask = async (task, token) => {
  const res = await fetch(`${API}/${task._id}`, {
    method: "PUT",
    headers: authHeader(token),
    body: JSON.stringify({ completada: !task.completada }),
  });

  return res.json();
};

export const updateTask = async (id, titulo, token) => {
  return fetch(`${API}/${id}`, {
    method: "PUT",
    headers: authHeader(token),
    body: JSON.stringify({ titulo }),
  });
};