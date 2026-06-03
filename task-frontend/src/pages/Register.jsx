import { useState } from "react";
import { registerUser, loginUser } from "../services/auth";

export default function Register({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const data = await registerUser(email, password);

    if (data.error) {
      setMsg(data.error);
      return;
    }

    // 🔥 auto login después de registro
    const loginData = await loginUser(email, password);

    if (loginData.token) {
      localStorage.setItem("token", loginData.token);
      setToken(loginData.token);
    } else {
      setMsg("Usuario creado pero no se pudo iniciar sesión");
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

      <button className="btn btn-primary" type="submit">
        Registrarse
      </button>

      <p>{msg}</p>
    </form>
  );
}