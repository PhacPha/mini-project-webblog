import React, { useState } from "react";
import { register } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const data = await register(username, password);
    if (data.msg === "User registered successfully") {
      navigate("/login");
    } else {
      setMsg(data.msg || "Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-800 rounded-xl w-full max-w-sm p-7 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-cyan-400 mb-6">สมัครสมาชิก</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-3">
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
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 rounded-lg transition"
            type="submit"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4">
          มีบัญชีแล้ว?{" "}
          <Link to="/login" className="text-cyan-400 font-medium hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
        {msg && <p className="text-center text-red-400 mt-4">{msg}</p>}
      </div>
    </div>
  );
}
