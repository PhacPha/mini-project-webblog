import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPost, addComment, likePost } from "../api";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await getPost(id);
      if (data) {
        setPost(data);
      } else {
        setMsg("Failed to load post");
      }
    } catch (error) {
      setMsg(error.message || "Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    try {
      const data = await likePost(localStorage.getItem("token"), id);
      if (data) {
        fetchPost();
      } else {
        setMsg("Failed to like post");
      }
    } catch (error) {
      setMsg(error.message || "Failed to like post");
    }
  };

  const handleComment = async () => {
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
        id,
        commentContent,
        replyTo ? replyTo.id : null
      );
      if (data) {
        setCommentContent("");
        setReplyTo(null);
        setMsg("Comment added successfully!");
        fetchPost();
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

  const handleReply = (comment) => {
    setReplyTo(comment);
    setCommentContent(`@${comment.author.username} `);
  };

  const cancelReply = () => {
    setReplyTo(null);
    setCommentContent("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-200 mb-4">Post not found</h2>
          <Link
            to="/"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            ✨ My Blog
          </Link>
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

        {/* Blog Post */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            {post.title}
          </h1>
          {post.summary && (
            <p className="text-gray-300 text-xl mb-6 italic">{post.summary}</p>
          )}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-xl">
              {post.author.username[0].toUpperCase()}
            </div>
            <div>
              <p className="text-gray-200 font-semibold">{post.author.username}</p>
              <p className="text-gray-400 text-sm">{post.created_at}</p>
            </div>
          </div>
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-lg">
              {post.content}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags && post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-6 pt-6 border-t border-purple-500/20">
            <button
              className="flex items-center gap-2 text-gray-300 hover:text-pink-400 transition-colors duration-300"
              onClick={handleLikePost}
            >
              <span className="text-xl">❤️</span>
              <span>{post.likes_count}</span>
            </button>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">{post.comments_count} Comments</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-200 mb-6">Comments</h2>
          
          {/* Comment Form */}
          <div className="mb-8">
            {replyTo && (
              <div className="mb-4 p-4 bg-white/5 rounded-xl border border-purple-500/20">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm">
                      {replyTo.author.username[0].toUpperCase()}
                    </span>
                    <span className="text-gray-300">Replying to {replyTo.author.username}</span>
                  </div>
                  <button
                    onClick={cancelReply}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <input
                className="flex-1 bg-white/10 border border-white/20 text-gray-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all duration-300 placeholder-gray-400"
                placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={handleComment}
              >
                {replyTo ? "Reply" : "Comment"}
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {post.comments && post.comments.map((comment) => (
              <div key={comment.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white">
                    {comment.author.username[0].toUpperCase()}
                  </span>
                  <div>
                    <h3 className="text-gray-200 font-semibold">{comment.author.username}</h3>
                    <p className="text-gray-400 text-sm">{comment.created_at}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{comment.content}</p>
                <button
                  onClick={() => handleReply(comment)}
                  className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
                >
                  Reply
                </button>
                
                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 space-y-4 pl-8 border-l-2 border-purple-500/20">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm">
                            {reply.author.username[0].toUpperCase()}
                          </span>
                          <div>
                            <h4 className="text-gray-200 text-sm font-semibold">{reply.author.username}</h4>
                            <p className="text-gray-400 text-xs">{reply.created_at}</p>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 