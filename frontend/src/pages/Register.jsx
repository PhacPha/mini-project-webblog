import React, { useState } from "react";
import { register } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!username.trim()) {
      setMsg("Username cannot be empty");
      return;
    }
    if (!password.trim()) {
      setMsg("Password cannot be empty");
      return;
    }
    if (username.trim().length < 3) {
      setMsg("Username must be at least 3 characters long");
      return;
    }
    if (password.trim().length < 6) {
      setMsg("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      setMsg("");
    const data = await register(username, password);
      if (data.access_token) {
        setMsg("Registration successful! Redirecting to login...");
        setTimeout(() => {
      navigate("/login");
        }, 1500);
      }
    } catch (error) {
      setMsg(error.message || "Registration failed");
    } finally {
      setLoading(false);
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
          <p className="text-gray-400">Create your account and start sharing your stories.</p>
        </div>

        {/* Register Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Register
          </h2>
          <form onSubmit={handleRegister} className="space-y-4">
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
                  placeholder="Choose a username"
            value={username}
            autoFocus
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setMsg("");
                  }}
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
                  placeholder="Choose a password"
            value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setMsg("");
                  }}
          />
              </div>
            </div>
          <button
              className="w-full bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
              disabled={loading}
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                )}
                {loading ? "Registering..." : "Register"}
              </div>
          </button>
        </form>

          {msg && (
            <div className={`mt-4 px-4 py-3 rounded-2xl text-center ${
              msg.includes("successful") 
                ? "bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-green-300"
                : "bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-300"
            }`}>
              <div className="flex items-center justify-center gap-2">
                {msg.includes("successful") ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {msg}
              </div>
            </div>
          )}

          <p className="text-center text-gray-300 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 font-medium hover:text-pink-400 transition-colors duration-300"
            >
              Login
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
