# 📝 Daily Notes - ขั้นตอนการเชื่อม backend -> frontend

## 🖥️ การแยกไฟล์ และการติดตั้ง Plungins เบื้องต้น

### 1. สร้าโฟล์เดอร์ **backend** ใหม่ และย้ายไฟล์ปัจจุบันทั้งหมดเข้าไปไว้ในนั้น

### 2. สร้างโฟล์เดอร์ **frontend** โดยใช้คำสั่ง ดังนี้

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

### 3. ติดตั้ง tailwindcss

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

### 4. import plugins tailwindcss และเรียกใช้งาน

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
});
```

> นำ `import tailwindcss from "@tailwindcss/vite";` และ `"@tailwindcss/postcss": {},` ไปว่างไว้ในไฟล์ `vite.config.js`

### 5. import tailwindcss ใน `src/index.css` และสามารถใช้งานได้เลย

```css
@import "tailwindcss";
```

อาจจะมีการเทสเบื่องต้น เช่น **การเปลี่ยนสีข้อความ** เป็นต้น

## 🚀 สร้างการติดต่อกับ backend

### 1. กำหนด API URL ใน Frontend

- แก้ไขหรือสร้างไฟล์ frontend/src/api.js
- กำหนดตัวแปร URL ให้ตรงกับที่ backend เปิดใช้งาน เช่น

```js
const API_URL = "http://localhost:5000/api";
```

> ในโค้ดใช้เป็น 5003 แต่สามารถเปลียนได้ภายหลัง

### 2. ตั้งค่า CORS ใน Backend (Flask)

- เปิดไฟล์ backend/app.py
- เพิ่มหรือแก้ไขโค้ด CORS ให้รองรับ frontend

```js
from flask_cors import CORS

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
```

### 3. เปิดใช้งาน API Endpoint ใน Backend

- ต้องแน่ใจว่า Flask app ลงทะเบียน Blueprint หรือ route ไว้ เช่น

```js
app.register_blueprint(auth, (url_prefix = "/api"));
app.register_blueprint(notes, (url_prefix = "/api"));
```

> จะได้ endpoint เช่น `/api/login, /api/register, /api/notes`

### 4. Frontend เรียก API ด้วย fetch หรือฟังก์ชันใน api.js

```js
// frontend/src/api.js

export const login = async (username, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
};
```

> ใช้ฟังก์ชันนี้ในหน้า Login ของ React

### 5. ส่ง JWT token (ถ้ามี) ใน header ทุก request ที่ต้องการ auth

```js
// frontend/src/api.js

export const getNotes = async (token) => {
  const res = await fetch(`${API_URL}/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
```

## 📱การสร้าง frontend

### 1. สร้างโฟล์เดอร์ gages สำหรับการเก็บหน้าต่าง ๆ ของเว็บไซต์

### 2. สร้างไฟล์ **Register.jsx, Login.jsx, Dashdoard.jsx**

### 3. เริ่มด้วยระบบสมัครสมชิก **( pages/Register.jsx )**

- **import** plungin ที่จำเป็นต้องใช้

```js
import React, { useState } from "react";
import { register } from "../api";
import { useNavigate, Link } from "react-router-dom";
```

- สร้างฟังก์ชั่น **Register** เพื่อนำไปเรียกใช้

```js
export default function Register() {
    ...
}
```

- สร้างส่วนติดต่อกับ API

```js
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
```

- สร้าง frontend ด้วย HTML + Tailwindcss โดยใช้

```js
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
)
```

### 4. เรียกใช้งาน Register โดยเรียกใช้ที่ **pages/App.jsx**

```js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### 5. ทดสอบระบบว่าสามารถทำงานได้หรือไม่ โดย RUN ทั้งสองฝั่ง

- Backend

```bash
cd backend
python app.py
```

> สำหรับใครที่รันไม่ได้เหมือนบักที่สร้าง README อันนี้ให้ใช้ `python3` นะจ๊ะะ

- Frontend

```bash
cd frontend
npm run dev
```

- Backend ควรเปิดที่พอร์ต 5000 (หรือพอร์ตที่ตั้งไว้ โดยที่ตั้งไว้ในโค้ดจะเป็น 5003)
- Frontend เปิดที่ 5173

## Extension ที่แนะนำสำหรับการพัฒนา

### Tailwind CSS IntelliSense

ช่วยเพิ่ม **Auto-complete** และ **Syntax Highlighting** สำหรับ **Tailwind CSS** บน VS Code

<h3>📌 ตัวอย่าง UI ใน VS Code</h3>

<p style="text-align: center;">
  <img src="https://bradlc.gallerycdn.vsassets.io/extensions/bradlc/vscode-tailwindcss/0.14.20/1748529157003/Microsoft.VisualStudio.Services.Icons.Default" width="100" alt="โลโก้ Tailwind CSS IntelliSense">

<p style="text-align: center;">
  <img src="https://raw.githubusercontent.com/tailwindlabs/tailwindcss-intellisense/main/packages/vscode-tailwindcss/.github/banner.png" width="700" alt="ตัวอย่าง UI">
</p>
