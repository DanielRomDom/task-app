import { useState } from "react";
import { registerUser, loginUser } from "../services/auth";

export default function Register({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMsg("");

    try {
      const data = await registerUser(email, password);

      if (data.error) {
        setMsg(data.error);
        return;
      }

      setMsg("Usuario creado. Iniciando sesión...");

      const loginData = await loginUser(email, password);

      if (loginData.token) {
        localStorage.setItem("token", loginData.token);
        setToken(loginData.token); // 👉 esto ya te mete dentro de la app
      } else {
        setMsg("Usuario creado pero no se pudo iniciar sesión");
      }
    } catch (err) {
      setMsg("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleRegister}>
      <h2>Registro</h2>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

       <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Creando cuenta..." : "Registrarse"}
      </button>

      {msg && <p>{msg}</p>}
    </form>
  );
}