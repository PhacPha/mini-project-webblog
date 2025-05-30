# 📝 Daily Notes - สำหรับ อ ที่ปรึกษาที่แสนดี

เว็บจดโน้ตส่วนตัว พัฒนาด้วย **React + Tailwind CSS** (Frontend) และ **Flask + MongoDB** (Backend)

## 🚀 ฟีเจอร์หลัก (Features)

- สมัครสมาชิก / เข้าสู่ระบบ (JWT Auth)
- เพิ่ม/ดู/แก้ไข/ลบโน้ตของตัวเอง
- UI สวย ทันสมัย (ใช้ Tailwind CSS)
- Responsive รองรับมือถือและคอมพิวเตอร์

## 🖥️ Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Flask + MongoDB (mongoengine) + Flask-JWT-Extended
- **API:** RESTful

---

## ⚡ วิธีติดตั้งและใช้งาน (Getting Started)

### 1. Clone Repo

```bash
git clone <repo-url>
cd <project-folder>
```

### 2. ติดตั้ง & รัน Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

> ตั้งค่า MongoDB ใน `config.py` (ค่าเริ่มต้นใช้ localhost)

### 3. ติดตั้ง & รัน Frontend

```bash
cd frontend
npm install
npm run dev
```

> เปิด http://localhost:5173

> ตรวจสอบ `src/api.js` ให้ API_URL ตรงกับ backend (ปกติคือ `http://localhost:5000/api`)

---

## 🌱 หมายเหตุ/เพิ่มเติม

- ปรับแต่งสี/ธีมง่ายมากด้วย Tailwind CSS
- สามารถ deploy ได้ทั้ง backend (Heroku, Render, etc.) และ frontend (Vercel, Netlify)
- หากต้องการฟีเจอร์เพิ่มเติม สามารถ fork และแก้ไขได้ทันที

---

## 🌏 English (Short version)

**Daily Notes** is a modern, mobile-friendly note-taking app.

- **Frontend:** React + Tailwind CSS
- **Backend:** Flask + MongoDB + JWT Auth
- Features: Register, Login, Create/Read/Update/Delete personal notes, beautiful UI.
- Quickstart:
  1. `pip install -r requirements.txt && python app.py` (backend)
  2. `npm install && npm run dev` (frontend)
- Easy deploy to Vercel/Netlify/Heroku/Render.

---

## 🙌 Thanks & License

โค้ดนี้เผยแพร่เพื่อการศึกษาและใช้งานทั่วไป  
**ขอให้สนุกกับการจดโน้ตและพัฒนา!**
