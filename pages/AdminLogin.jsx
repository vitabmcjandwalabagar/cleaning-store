import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === "12345") {
      localStorage.setItem("isAdmin", "true");
      window.location.href = "/admin-products";
    } else {
      alert("Wrong Password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-500 mt-2">Only admin can access this page</p>
        </div>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}