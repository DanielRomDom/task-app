const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const Task = require("./models/Task");

const cors = require("cors");

app.use(cors());

app.use(express.json());

// 🔗 CONEXIÓN A MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.log("❌ Error de conexión:", err));

// 🧪 RUTA DE PRUEBA
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// 📌 GET TASKS
app.get("/tasks", async (req, res) => {
  try {
    const tareas = await Task.find();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tareas" });
  }
});

// 📌 POST TASKS
app.post("/tasks", async (req, res) => {
  try {
    const nuevaTarea = new Task(req.body);
    await nuevaTarea.save();
    res.json(nuevaTarea);
  } catch (error) {
    res.status(500).json({ error: "Error al crear tarea" });
  }
});

// ELIMINAR TAREAS
app.delete("/tasks/:id", async (req, res) => {
  try {
    const tareaEliminada = await  Task.findByIdAndDelete(req.params.id);

    if (!tareaEliminada) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.json({ mensaje: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar tarea" });
  }
});

// ACTUALIZAR TAREAS
app.put("/tasks/:id", async (req, res) => {
  try{
    const tareaActualizada = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Tarea actualizada
    );

    if (!tareaActualizada) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.json(tareaActualizada);
  } catch(error) {
    res.status(500).json({ error: "Error al actualizar tarea" });
  }
});

// 🚀 SERVIDOR (SIEMPRE AL FINAL)
app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});