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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6 tracking-wide">สมัครสมาชิก</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            type="text"
            placeholder="Username"
            value={username}
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
            type="submit"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4">
          มีบัญชีแล้ว?{" "}
          <Link to="/login" className="text-green-600 font-semibold hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
        {msg && <p className="text-center text-red-500 mt-4">{msg}</p>}
      </div>
    </div>
  );
}
