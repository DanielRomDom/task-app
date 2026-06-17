import { useState } from "react";
import { registerUser } from "../services/auth";

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
      // 1. registrar usuario
      const data = await registerUser(email, password);

      if (data.error) {
        setMsg(data.error);
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        setMsg(data.error || "Error al registrar");
      }

    } catch (err) {
      setMsg(err.message);
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