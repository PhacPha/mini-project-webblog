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
    try {
    const data = await login(username, password);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", data.username);
      navigate("/");
    } catch (error) {
      setMsg(error.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900 p-4">
      <div className="w-full max-w-sm">
        {/* Logo/Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            ✨ My Blog
          </h1>
          <p className="text-gray-400">Welcome back! Please login to your account.</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
          <input
                  className="w-full bg-white/10 border border-white/20 text-gray-100 rounded-2xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all duration-300 placeholder-gray-400"
            type="text"
                  placeholder="Enter your username"
            value={username}
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
          />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
          <input
                  className="w-full bg-white/10 border border-white/20 text-gray-100 rounded-2xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all duration-300 placeholder-gray-400"
            type="password"
                  placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
              </div>
            </div>
          <button
              className="w-full bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm"
            type="submit"
          >
              <div className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
            Login
              </div>
          </button>
        </form>

          {msg && (
            <div className="mt-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-300 px-4 py-3 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {msg}
              </div>
            </div>
          )}

          <p className="text-center text-gray-300 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-purple-400 font-medium hover:text-pink-400 transition-colors duration-300"
            >
              Register
          </Link>
        </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 mt-8 text-sm">
          © 2024 My Blog. All rights reserved.
        </p>
      </div>
    </div>
  );
}
