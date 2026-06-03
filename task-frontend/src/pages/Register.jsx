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
      // 1. registrar usuario
      const data = await registerUser(email, password);

      if (data.error) {
        setMsg(data.error);
        return;
      }

      setMsg("Creando sesión...");

      // 2. pequeño retry de login (IMPORTANTE en Render)
      let loginData = null;

      for (let i = 0; i < 3; i++) {
        loginData = await loginUser(email, password);

        if (loginData?.token) break;

        await new Promise((r) => setTimeout(r, 800));
      }

      // 3. si login OK → entrar
      if (loginData?.token) {
        localStorage.setItem("token", loginData.token);
        setToken(loginData.token);
      } else {
        setMsg("Usuario creado, pero el login tardó demasiado. Inicia sesión.");
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