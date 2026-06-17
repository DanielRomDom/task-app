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
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);

  // 📌 cargar tareas
  const loadTasks = useCallback(async () => {
    if (!token) return;

    setTasks([]);

    try {
      const data = await getTasks(token);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando tareas:", err);
      setTasks([]);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setTasks([]); // 👈 limpia tareas al logout/login
      return;
    }

    setTasks([]); // 👈 evita flash de datos antiguos
    loadTasks();
  }, [token, loadTasks]);

  useEffect(() => {
    const wakeServer = async () => {
      try {
        await fetch("https://task-app-59x9.onrender.com");
      } catch (err) {
        console.log("Servidor aún dormido");
      }
    };

    wakeServer();
  }, []);

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
      }, 180);
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
              <Register setToken={setToken} />
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

      <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            setToken(null);
          }}
        >
          Logout
        </button>
        
      <div className="card">
        <h1>Task App 🚀</h1>

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

          <button className="btn btn-primary" onClick={editId ? handleUpdate : addTask}>
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
                  className="btn btn-neutral"
                  onClick={() => setDeleteId(null)}
                >
                  Cancelar
                </button>

                <button className="btn btn-danger" onClick={() => handleDelete()}>
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