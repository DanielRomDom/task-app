const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const Task = require("./models/Task");

const cors = require("cors");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const User = require("./models/User");

app.use(cors({
  origin: "*"
}));

app.use(express.json());

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

// 🔗 CONEXIÓN A MONGODB
console.log("MONGO_URI =", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB conectado");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log("❌ Error de conexión:", err));

// 🧪 RUTA DE PRUEBA
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// 📌 GET TASKS
app.get("/tasks", auth, async (req, res) => {
  try {
    const tareas = await Task.find({ userId: req.user.id });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tareas" });
  }
});

// 📌 POST TASKS
app.post("/tasks", auth, async (req, res) => {
  try {
    const nuevaTarea = new Task({
      ...req.body,
      userId: req.user.id   // 🔥 AÑADIDO AQUÍ
    });

    await nuevaTarea.save();
    res.json(nuevaTarea);
  } catch (error) {
    res.status(500).json({ error: "Error al crear tarea" });
  }
});

// ELIMINAR TAREAS
app.delete("/tasks/:id", auth, async (req, res) => {
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
app.put("/tasks/:id", auth, async (req, res) => {
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

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword
    });

    res.json({
      _id: user._id,
      email: user.email
    });

  } catch (err) {
    res.status(500).json({ error: "Error en servidor" });
  }
});

app.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Usuario no existe" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login correcto",
      token,
      user: {
        _id: user._id,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: "Error en servidor" });
  }
});