import React, { useState } from "react";
import { login } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = await login(username, password);
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } else {
      setMsg(data.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-800 rounded-xl w-full max-w-sm p-7 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-cyan-400 mb-6">เข้าสู่ระบบ</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            className="border border-gray-700 bg-gray-900 text-gray-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 outline-none"
            type="text"
            placeholder="Username"
            value={username}
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="border border-gray-700 bg-gray-900 text-gray-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 outline-none"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded-lg transition"
            type="submit"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4">
          ยังไม่มีบัญชี?{" "}
          <Link to="/register" className="text-yellow-400 font-medium hover:underline">
            สมัครสมาชิก
          </Link>
        </p>
        {msg && <p className="text-center text-red-400 mt-4">{msg}</p>}
      </div>
    </div>
  );
}
