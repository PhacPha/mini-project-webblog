import React, { useEffect, useState } from "react";
import { getNotes, createNote, updateNote, deleteNote } from "../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
    fetchNotes();
    // eslint-disable-next-line
  }, []);

  const fetchNotes = async () => {
    const data = await getNotes(token);
    setNotes(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title) return setMsg("กรุณากรอกชื่อโน้ต");
    const data = await createNote(token, title, content);
    setMsg(data.msg);
    setTitle("");
    setContent("");
    fetchNotes();
  };

  const handleEdit = (note) => {
    setEditId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editTitle) return setMsg("กรุณากรอกชื่อโน้ต");
    const data = await updateNote(token, editId, editTitle, editContent);
    setMsg(data.msg);
    setEditId(null);
    fetchNotes();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("ต้องการลบโน้ตนี้ใช่ไหม?")) return;
    const data = await deleteNote(token, id);
    setMsg(data.msg);
    fetchNotes();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-2">
          <h1 className="text-3xl font-extrabold text-pink-700 tracking-tight">📝 Daily Notes</h1>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        {/* ฟอร์มเพิ่มโน้ตใหม่ */}
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-2 mb-8">
          <input
            className="border rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
          />
          <input
            className="border rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={120}
          />
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition">
            Add
          </button>
        </form>
        {msg && <p className="text-green-600 mb-2">{msg}</p>}

        {/* รายการโน้ต */}
        <div className="space-y-4">
          {notes.length === 0 && (
            <div className="text-center text-gray-400">ยังไม่มีโน้ต</div>
          )}
          {notes.map((note) =>
            editId === note.id ? (
              // Edit Mode
              <form
                key={note.id}
                onSubmit={handleUpdate}
                className="flex flex-col sm:flex-row gap-2 bg-blue-50 p-4 rounded-lg shadow"
              >
                <input
                  className="border rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  maxLength={60}
                />
                <input
                  className="border rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  maxLength={120}
                />
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-lg transition">
                  Save
                </button>
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 px-4 rounded-lg transition"
                  onClick={() => setEditId(null)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              // View Mode
              <div
                key={note.id}
                className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-lg shadow"
              >
                <div className="flex-1">
                  <div className="text-lg font-semibold text-gray-800">{note.title}</div>
                  <div className="text-gray-600">{note.content}</div>
                  <div className="text-xs text-gray-400 mt-1">{note.created_at}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 px-4 rounded-lg font-semibold transition"
                    onClick={() => handleEdit(note)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-400 hover:bg-red-500 text-white px-4 rounded-lg font-semibold transition"
                    onClick={() => handleDelete(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
