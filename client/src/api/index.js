import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 120000, // 2 minutes for Render free tier wake-up
  withCredentials: true,
});

// Add request interceptor to include JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Utility function to extract data from ApiResponse wrapper
const extractResponseData = (response) => {
  // If response has the ApiResponse structure (statusCode, message, data)
  if (
    response.data &&
    typeof response.data === "object" &&
    "statusCode" in response.data
  ) {
    return {
      statusCode: response.data.statusCode,
      message: response.data.message,
      data: response.data.data,
    };
  }
  // Otherwise return the response as is
  return response.data;
};

// Auth api calles

export const loginUser = async ({ email, password }) => {
  const response = await apiClient.post("/public/login", { email, password });
  return extractResponseData(response);
};

export const logoutUser = async () => {
  const response = await apiClient.post("/user/logout");
  return extractResponseData(response);
};

export const registerUser = async ({ name, userName, email, password }) => {
  const response = await apiClient.post("/public/signup", {
    name,
    userName,
    email,
    password,
  });
  return extractResponseData(response);
};

export const verifyOtp = async ({ email, otp }) => {
  const response = await apiClient.post("/public/otp-verification", {
    email,
    otp,
  });
  return extractResponseData(response);
};

export const resendOtp = async ({ email }) => {
  const response = await apiClient.post("/public/login", {
    email,
    password: "",
  });
  return extractResponseData(response);
};

export const getLogedInUser = async () => {
  const response = await apiClient.get("/user/me");
  return extractResponseData(response);
};

// user profile calles

export const getUserProfile = async (userName) => {
  const response = await apiClient.get(`/public/get-user/${userName}`);
  return extractResponseData(response);
};

// Blog related calls

export const getPosts = async () => {
  const response = await apiClient.get("/public/get-all-blog-posts");
  return extractResponseData(response);
};

export const getPost = async (blogId) => {
  const response = await apiClient.get(`/public/get-blog-post/${blogId}`);
  return extractResponseData(response);
};

export const getUserPosts = async (userName) => {
  const response = await apiClient.get(
    `/public/user/${userName}/get-user-post`
  );
  return extractResponseData(response);
};

export const createPost = async (data) => {
  const response = await apiClient.post("/blog/create", data);
  return extractResponseData(response);
};

export const deletePost = async (blogId) => {
  const response = await apiClient.delete(`/blog/${blogId}`);
  return extractResponseData(response);
};

export const editPost = async ({ blogId, data }) => {
  const response = await apiClient.post(`/blog/edit/${blogId}`, data);
  return extractResponseData(response);
};

// comment
export const createComment = async ({ blogId, content }) => {
  const response = await apiClient.post(`/comment/${blogId}/create-comment`, {
    content,
  });
  return extractResponseData(response);
};

export const getPostComments = async (blogId) => {
  const response = await apiClient.get(`/public/${blogId}/get-blog-comments`);
  return extractResponseData(response);
};

export const followUser = async (userName) => {
  const response = await apiClient.post(`/follow/${userName}/follow-user`);
  return extractResponseData(response);
};

export const unfollowUser = async (userName) => {
  const response = await apiClient.delete(`/follow/${userName}/unfollow-user`);
  return extractResponseData(response);
};

export const likeBlogPost = async (blogId) => {
  const response = await apiClient.post(`/like/${blogId}/like-blog-post`);
  return extractResponseData(response);
};

export const unlikeBlogPost = async (blogId) => {
  const response = await apiClient.delete(`/like/${blogId}/unlike-blog-post`);
  return extractResponseData(response);
};

export const searchPost = async (query) => {
  const response = await apiClient.get(`/public/get-blog-search/${query}`);
  return extractResponseData(response);
};

// User profile update APIs
export const updateUser = async (userData) => {
  const response = await apiClient.put("/user/update-profile", userData);
  return extractResponseData(response);
};

export const updateAvatar = async (formData) => {
  const response = await apiClient.put("/user/update-profile-pic", formData);
  return extractResponseData(response);
};

export const changePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
  const response = await apiClient.put("/user/change-password", {
    currentPassword,
    newPasssword: newPassword,
    confirmPassword,
  });
  return extractResponseData(response);
};

export default apiClient;
