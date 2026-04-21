"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const { error } = await signUp(email, password);

    if (error) {
      alert(error.message);
    } else {
      alert("Account Created");
      router.push("/login");
    }
  };

  return (
    <div style={container}>
      <h1>Signup</h1>

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

      <button onClick={handleSignup} style={btn}>
        Create Account
      </button>
    </div>
  );
}

const container = { maxWidth: "400px", margin: "100px auto" };
const input = { width: "100%", padding: "10px", marginBottom: "10px" };
const btn = { width: "100%", padding: "10px", background: "green", color: "#fff" };