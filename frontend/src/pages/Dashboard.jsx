import React, { useEffect, useState } from "react";
import { getPosts, createPost, updatePost, deletePost, likePost, addComment } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [msg, setMsg] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editTags, setEditTags] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTag, setSelectedTag] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchPosts();
    // eslint-disable-next-line
  }, [currentPage, selectedTag]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts(currentPage, 10, selectedTag);
      if (data && Array.isArray(data)) {
        // Filter posts to show only the current user's posts
        const userPosts = data.filter(post => post.author.username === username);
        setPosts(userPosts);
        setTotalPages(Math.ceil(userPosts.length / 10));
      } else {
        setPosts([]);
        setTotalPages(1);
      }
    } catch (error) {
      setMsg(error.message || "Failed to fetch posts");
      setPosts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setMsg("Please enter a title");
      return;
    }
    if (!content.trim()) {
      setMsg("Please enter content");
      return;
    }
    try {
      const tagArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag);
      const data = await createPost(token, title, content, summary, tagArray);
      if (data) {
        setMsg("Post created successfully!");
        setTitle("");
        setContent("");
        setSummary("");
        setTags("");
        setShowCreateForm(false);
        fetchPosts();
      }
    } catch (error) {
      setMsg(error.message || "Failed to create post");
    }
  };

  const handleEdit = (post) => {
    setEditId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditSummary(post.summary || "");
    setEditTags(post.tags ? post.tags.join(", ") : "");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      setMsg("Please enter a title");
      return;
    }
    if (!editContent.trim()) {
      setMsg("Please enter content");
      return;
    }
    try {
      const tagArray = editTags.split(",").map(tag => tag.trim()).filter(tag => tag);
      const data = await updatePost(token, editId, editTitle, editContent, editSummary, tagArray);
      if (data) {
        setMsg("Post updated successfully!");
        setEditId(null);
        fetchPosts();
      }
    } catch (error) {
      setMsg(error.message || "Failed to update post");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const data = await deletePost(token, id);
      if (data) {
        setMsg("Post deleted successfully!");
        fetchPosts();
      }
    } catch (error) {
      setMsg(error.message || "Failed to delete post");
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const data = await likePost(token, postId);
      if (data) {
        fetchPosts();
      }
    } catch (error) {
      setMsg(error.message || "Failed to like post");
    }
  };

  const handleComment = async (postId) => {
    if (!commentContent.trim()) {
      setMsg("Please enter a comment");
      return;
    }
    try {
      const data = await addComment(token, postId, commentContent);
      if (data) {
        setMsg("Comment added successfully!");
        setCommentContent("");
        fetchPosts();
      }
    } catch (error) {
      setMsg(error.message || "Failed to add comment");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ✨ My Blog
          </h1>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="bg-white/10 hover:bg-white/20 text-gray-200 px-4 py-2 rounded-2xl transition-all duration-300 flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 text-gray-200 px-4 py-2 rounded-2xl transition-all duration-300 flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Create Blog Button */}
        {!showCreateForm && (
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Blog
            </button>
          </div>
        )}

        {/* Create Post Form */}
        {showCreateForm && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-200">Create New Blog Post</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors duration-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-gray-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all duration-300 placeholder-gray-400"
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Summary
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-gray-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all duration-300 placeholder-gray-400"
                  rows="2"
                  placeholder="Enter post summary"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-gray-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all duration-300 placeholder-gray-400"
                  rows="4"
                  placeholder="Enter post content"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-gray-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all duration-300 placeholder-gray-400"
                  placeholder="Enter tags (e.g., tech, lifestyle, travel)"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-white/10 hover:bg-white/20 text-gray-200 px-6 py-2 rounded-2xl transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm flex items-center gap-2"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Post
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* Error Message */}
        {msg && !loading && (
          <div className="mb-8 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-300 px-4 py-3 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {msg}
            </div>
          </div>
        )}

        {/* Posts List */}
        {!loading && (
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center text-gray-400 bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
                No posts yet
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4"
                >
                  {editId === post.id ? (
                    // Edit Form
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 text-gray-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all duration-300 placeholder-gray-400"
                          placeholder="Enter post title"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Summary
                        </label>
                        <textarea
                          value={editSummary}
                          onChange={(e) => setEditSummary(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 text-gray-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all duration-300 placeholder-gray-400"
                          rows="2"
                          placeholder="Enter post summary"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Content
                        </label>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 text-gray-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all duration-300 placeholder-gray-400"
                          rows="4"
                          placeholder="Enter post content"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={editTags}
                          onChange={(e) => setEditTags(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 text-gray-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all duration-300 placeholder-gray-400"
                          placeholder="Enter tags (e.g., tech, lifestyle, travel)"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditId(null)}
                          className="flex-1 bg-black/50 border border-purple-500/30 text-gray-300 px-6 py-3 rounded-xl transition-all duration-300 hover:bg-purple-500/20"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    // View Mode
                    <>
                      <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                          {post.title}
                        </h2>
                        {post.summary && (
                          <p className="text-gray-300 mb-4 italic">{post.summary}</p>
                        )}
                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.tags && post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-gray-400 mt-4 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white">
                            {post.author.username[0].toUpperCase()}
                          </span>
                          <span>Posted by {post.author.username}</span>
                          <span>•</span>
                          <span>{post.created_at}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 pt-4 border-t border-purple-500/20">
                        <button
                          className="flex items-center gap-2 text-gray-300 hover:text-pink-400 transition-colors duration-300"
                          onClick={() => handleLikePost(post.id)}
                        >
                          <span className="text-xl">❤️</span>
                          <span>{post.likes_count}</span>
                        </button>
                        <button
                          className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors duration-300"
                          onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                        >
                          <span className="text-xl">💬</span>
                          <span>{post.comments_count}</span>
                        </button>
                      </div>

                      {selectedPost === post.id && (
                        <div className="space-y-4 pt-4 border-t border-purple-500/20">
                          <div className="space-y-3">
                            {post.comments && post.comments.map((comment) => (
                              <div key={comment.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm">
                                    {comment.author.username[0].toUpperCase()}
                                  </span>
                                  <span className="text-sm text-gray-400">
                                    {comment.author.username}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    • {comment.created_at}
                                  </span>
                                </div>
                                <p className="text-gray-300">{comment.content}</p>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-3">
                            <input
                              className="flex-1 bg-white/10 border border-white/20 text-gray-100 rounded-2xl px-4 py-2 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all duration-300 placeholder-gray-400"
                              placeholder="Write a comment..."
                              value={commentContent}
                              onChange={(e) => setCommentContent(e.target.value)}
                            />
                            <button
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                              onClick={() => handleComment(post.id)}
                            >
                              Comment
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 pt-4 border-t border-purple-500/20">
                        <button
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                          onClick={() => handleEdit(post)}
                        >
                          Edit
                        </button>
                        <button
                          className="flex-1 bg-black/50 border border-red-500/30 text-red-300 px-6 py-3 rounded-xl transition-all duration-300 hover:bg-red-500/20"
                          onClick={() => handleDelete(post.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-8">
            <button
              className="bg-black/40 border border-purple-500/20 text-gray-300 px-6 py-3 rounded-xl transition-all duration-300 hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="bg-black/40 border border-purple-500/20 text-gray-300 px-6 py-3 rounded-xl">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="bg-black/40 border border-purple-500/20 text-gray-300 px-6 py-3 rounded-xl transition-all duration-300 hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
