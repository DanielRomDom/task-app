import { useState } from "react";
import { loginUser } from "../services/auth";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const data = await loginUser(email, password);

    if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input onChange={(e) => setEmail(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleLogin}>
        Entrar
      </button>
    </div>
  );
}