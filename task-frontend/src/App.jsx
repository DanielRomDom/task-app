import { useEffect, useState } from "react";
import "./App.css";
import TaskList from "./components/TaskList";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useCallback } from "react";

import {
  getTasks,
  createTask,
  deleteTask as deleteTaskService,
  toggleTask,
  updateTask,
} from "./services/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);

  // 📌 cargar tareas
  const loadTasks = useCallback(async () => {
    const data = await getTasks(token);
    setTasks(Array.isArray(data) ? data : []);
  }, [token]);

  useEffect(() => {
    if (token) {
      loadTasks();
    }
  }, [token, loadTasks]);

  // 📌 crear tarea
  const addTask = async () => {
    if (!titulo.trim()) return;

    await createTask(titulo, token);
    setTitulo("");
    loadTasks();
  };

  // 📌 update tarea
  const handleUpdate = async () => {
    await updateTask(editId, editText, token);

    setEditId(null);
    setEditText("");
    loadTasks();
  };

  // 📌 delete con animación
  const handleDelete = async (id = deleteId) => {
    setDeleteId(null);

    setTimeout(() => {
      const element = document.querySelector(`[data-id="${id}"]`);

      if (element) {
        element.classList.add("deleting");
      }

      setTimeout(async () => {
        await deleteTaskService(id, token);
        loadTasks();
      }, 300);
    }, 100);
  };

  const handleToggle = async (task) => {
    await toggleTask(task, token);
    loadTasks();
  };

  if (!token) {
    return (
      <div className="container">
        <div className="card">
          <h1>Task App 🚀</h1>

          {showRegister ? (
            <>
              <Register />
              <p onClick={() => setShowRegister(false)}>
                ¿Ya tienes cuenta? Login
              </p>
            </>
          ) : (
            <>
              <Login setToken={setToken} />
              <p onClick={() => setShowRegister(true)}>
                ¿No tienes cuenta? Regístrate
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Task App 🚀</h1>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            setToken(null);
          }}
        >
          Logout
        </button>

        <div className={`task-form ${editId ? "editing" : ""}`}>
          <input
            value={editId ? editText : titulo}
            onChange={(e) =>
              editId ? setEditText(e.target.value) : setTitulo(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                editId ? handleUpdate() : addTask();
              }
            }}
            placeholder={editId ? "Editar tarea..." : "Nueva tarea..."}
          />

          <button onClick={editId ? handleUpdate : addTask}>
            {editId ? "Guardar" : "Crear"}
          </button>

          {editId && (
            <button
              onClick={() => {
                setEditId(null);
                setEditText("");
              }}
            >
              Cancelar
            </button>
          )}
        </div>

        <TaskList
          tasks={tasks}
          onEdit={(t) => {
            setEditId(t._id);
            setEditText(t.titulo);
          }}
          onToggle={handleToggle}
          onDelete={(id) => setDeleteId(id)}
        />

        {/* MODAL */}
        {deleteId && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>¿Eliminar tarea?</h3>

              <div className="modal-buttons">
                <button
                  className="cancel-btn"
                  onClick={() => setDeleteId(null)}
                >
                  Cancelar
                </button>

                <button className="danger" onClick={() => handleDelete()}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;