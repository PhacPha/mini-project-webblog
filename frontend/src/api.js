const API_URL = "http://localhost:5003/api";

export const register = async (username, password) => {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || "Registration failed");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || "Login failed");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const getPosts = async (page = 1, perPage = 10, tag = null) => {
  try {
    let url = `${API_URL}/posts?page=${page}&per_page=${perPage}`;
    if (tag) url += `&tag=${tag}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || "Failed to fetch posts");
    }
    return data.posts || [];
  } catch (error) {
    throw error;
  }
};

export const getPost = async (postId) => {
  const res = await fetch(`${API_URL}/posts/${postId}`);
  return res.json();
};

export const createPost = async (token, title, content, summary = "", tags = []) => {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content, summary, tags }),
  });
  return res.json();
};

export const updatePost = async (token, postId, title, content, summary, tags) => {
  const res = await fetch(`${API_URL}/posts/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content, summary, tags }),
  });
  return res.json();
};

export const deletePost = async (token, postId) => {
  const res = await fetch(`${API_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const likePost = async (token, postId) => {
  const res = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const addComment = async (token, postId, content) => {
  const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  return res.json();
};
