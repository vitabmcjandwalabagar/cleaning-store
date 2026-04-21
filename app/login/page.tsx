"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await signIn(email, password);

    if (error) {
      alert(error.message);
    } else {
      alert("Login Success");
      router.push("/products");
    }
  };

  return (
    <div style={container}>
      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={input}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={input}
      />

      <button onClick={handleLogin} style={btn}>
        Login
      </button>
    </div>
  );
}

const container = { maxWidth: "400px", margin: "100px auto" };
const input = { width: "100%", padding: "10px", marginBottom: "10px" };
const btn = { width: "100%", padding: "10px", background: "blue", color: "#fff" };