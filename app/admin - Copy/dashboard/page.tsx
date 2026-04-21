"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Admin Login</h1>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {error ? <p style={styles.error}>{error}</p> : null}
        </form>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  title: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: 700,
    marginBottom: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  input: {
    padding: "14px 16px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    outline: "none",
  },
  button: {
    padding: "14px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "none",
    background: "#1677ff",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: "8px",
  },
};