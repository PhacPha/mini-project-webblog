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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 text-gray-100">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-cyan-400">📝 Daily Notes</h1>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        {/* ฟอร์มเพิ่มโน้ตใหม่ */}
        <form onSubmit={handleCreate} className="flex gap-2 mb-6 flex-col sm:flex-row">
          <input
            className="border border-gray-700 bg-gray-900 text-gray-100 rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-cyan-400 outline-none"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
          />
          <input
            className="border border-gray-700 bg-gray-900 text-gray-100 rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-cyan-400 outline-none"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={120}
          />
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg transition">
            Add
          </button>
        </form>
        {msg && <p className="text-green-400 mb-2">{msg}</p>}

        {/* รายการโน้ต */}
        <div className="space-y-3">
          {notes.length === 0 && (
            <div className="text-center text-gray-500">ยังไม่มีโน้ต</div>
          )}
          {notes.map((note) =>
            editId === note.id ? (
              // Edit Mode
              <form
                key={note.id}
                onSubmit={handleUpdate}
                className="flex gap-2 bg-gray-700 p-3 rounded-lg"
              >
                <input
                  className="border border-gray-600 bg-gray-900 text-gray-100 rounded-lg px-2 py-1 flex-1 focus:ring-2 focus:ring-cyan-300 outline-none"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  maxLength={60}
                />
                <input
                  className="border border-gray-600 bg-gray-900 text-gray-100 rounded-lg px-2 py-1 flex-1 focus:ring-2 focus:ring-cyan-300 outline-none"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  maxLength={120}
                />
                <button className="bg-green-600 hover:bg-green-700 text-white px-3 rounded-lg transition">
                  Save
                </button>
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 rounded-lg"
                  onClick={() => setEditId(null)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              // View Mode
              <div
                key={note.id}
                className="flex flex-col sm:flex-row justify-between items-center gap-2 bg-gray-700 p-3 rounded-lg"
              >
                <div className="flex-1">
                  <div className="text-base font-medium text-cyan-300">{note.title}</div>
                  <div className="text-gray-300 text-sm">{note.content}</div>
                  <div className="text-xs text-gray-500 mt-1">{note.created_at}</div>
                </div>
                <div className="flex gap-1">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 rounded-lg transition"
                    onClick={() => handleEdit(note)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 rounded-lg transition"
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
