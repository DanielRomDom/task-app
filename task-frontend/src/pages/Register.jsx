import { useState } from "react";
import { registerUser } from "../services/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    const data = await registerUser(email, password);

    if (data.error) {
      setMsg(data.error);
    } else {
      setMsg("Usuario creado ✅");
    }
  };

  return (
    <div>
      <h2>Registro</h2>

      <input
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>
        Registrarse
      </button>

      <p>{msg}</p>
    </div>
  );
}