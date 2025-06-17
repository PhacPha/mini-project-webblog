import React, { useState, useEffect } from "react";
import { getPosts, likePost, addComment } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        setPosts([]);
        setMsg("Failed to load posts");
      }
    } catch (error) {
      setPosts([]);
      setMsg(error.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    try {
      const data = await likePost(localStorage.getItem("token"), postId);
      if (data) {
        fetchPosts();
      } else {
        setMsg("Failed to like post");
      }
    } catch (error) {
      setMsg(error.message || "Failed to like post");
    }
  };

  const handleCreateComment = async (postId) => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    if (!newComment[postId]?.trim()) return;

    try {
      const data = await addComment(
        localStorage.getItem("token"),
        postId,
        newComment[postId]
      );
      if (data) {
        setNewComment({ ...newComment, [postId]: "" });
        fetchPosts();
      } else {
        setMsg("Failed to create comment");
      }
    } catch (error) {
      setMsg(error.message || "Failed to create comment");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ✨ My Blog
          </h1>
          <div className="flex items-center gap-4">
            {localStorage.getItem("token") ? (
              <>
                <Link
                  to="/dashboard"
                  className="bg-white/10 hover:bg-white/20 text-gray-200 px-4 py-2 rounded-2xl transition-all duration-300 flex items-center gap-2"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    navigate("/login");
                  }}
                  className="bg-white/10 hover:bg-white/20 text-gray-200 px-4 py-2 rounded-2xl transition-all duration-300 flex items-center gap-2"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-white/10 hover:bg-white/20 text-gray-200 px-4 py-2 rounded-2xl transition-all duration-300 flex items-center gap-2"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {msg && (
          <div className="mb-8 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-300 px-4 py-3 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {msg}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">
              No Posts Yet
            </h3>
            <p className="text-gray-400">
              Be the first to share your thoughts!
            </p>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {post.author.username[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-gray-200 font-semibold">
                      {post.author.username}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(post.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-200 mb-2">
                  {post.title}
                </h2>
                {post.summary && (
                  <p className="text-gray-300 mb-4">{post.summary}</p>
                )}
                <p className="text-gray-200 mb-4">{post.content}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors duration-300"
                  >
                    <svg
                      className="h-5 w-5"
                      fill={post.liked ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {post.likes_count} Likes
                  </button>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">
                    {post.comments_count} Comments
                  </span>
                </div>

                {/* Comments Section */}
                <div className="space-y-4">
                  {post.comments &&
                    post.comments.slice(0, 2).map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                            {comment.author.username[0].toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-gray-200 text-sm font-semibold">
                              {comment.author.username}
                            </h4>
                            <p className="text-gray-400 text-xs">
                              {new Date(comment.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">
                          {comment.content}
                        </p>
                      </div>
                    ))}

                  {post.comments && post.comments.length > 2 && (
                    <p className="text-gray-400 text-sm text-center">
                      +{post.comments.length - 2} more comments
                    </p>
                  )}

                  {/* Add Comment Form */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={newComment[post.id] || ""}
                      onChange={(e) =>
                        setNewComment({
                          ...newComment,
                          [post.id]: e.target.value,
                        })
                      }
                      className="flex-1 bg-white/10 border border-white/20 text-gray-100 rounded-2xl px-4 py-2 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all duration-300 placeholder-gray-400"
                    />
                    <button
                      onClick={() => handleCreateComment(post.id)}
                      className="w-10 h-10 bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm flex items-center justify-center"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
