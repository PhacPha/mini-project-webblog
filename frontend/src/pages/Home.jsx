import React, { useState, useEffect } from "react";
import { getPosts, likePost, addComment } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
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

  const handleComment = async (postId) => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    if (!commentContent.trim()) {
      setMsg("Please enter a comment");
      return;
    }

    try {
      const data = await addComment(
        localStorage.getItem("token"),
        postId,
        commentContent
      );
      if (data) {
        setCommentContent("");
        setMsg("Comment added successfully!");
        fetchPosts();
      }
    } catch (error) {
      setMsg(error.message || "Failed to create comment");
      if (error.message.includes("401")) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/login");
      }
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

      <main className="max-w-4xl mx-auto px-4 py-8">
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

        {/* Posts List */}
        {!loading && posts.length > 0 && (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4"
              >
                <div>
                  <Link
                    to={`/post/${post.id}`}
                    className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                  >
                    {post.title}
                  </Link>
                  {post.summary && (
                    <p className="text-gray-300 mb-4 italic">{post.summary}</p>
                  )}
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed line-clamp-3">{post.content}</p>
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
                  <Link
                    to={`/post/${post.id}`}
                    className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors duration-300"
                  >
                    <span className="text-xl">💬</span>
                    <span>{post.comments_count} Comments</span>
                  </Link>
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
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
