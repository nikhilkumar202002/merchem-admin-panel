import api from "./axios";

// Token storage keys
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// Helper functions for localStorage
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const setToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export const getStoredUser = () => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
};

export const setStoredUser = (user) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Login API
 * POST /v1/auth/login
 * @param {Object} credentials - { email, password }
 */
export const loginApi = async (credentials) => {
  try {
    const response = await api.post("/v1/auth/login", credentials);
    const data = response.data;

    // Support common Laravel API token structures:
    // data.token, data.access_token, data.data.token, data.data.access_token
    const token =
      data.token ||
      data.access_token ||
      data?.data?.token ||
      data?.data?.access_token;

    if (token) {
      setToken(token);
    }

    const user = data.user || data?.data?.user;
    if (user) {
      setStoredUser(user);
    }

    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get Logged-in User Profile API
 * GET /v1/auth/me
 */
export const getMeApi = async () => {
  try {
    const response = await api.get("/v1/auth/me");
    const data = response.data;
    const user = data.data?.user || data.user || data.data || data;
    if (user && typeof user === "object" && user.name) {
      setStoredUser(user);
    } else if (data.data && typeof data.data === "object") {
      setStoredUser(data.data);
    }
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Logout API
 * POST /v1/auth/logout
 */
export const logoutApi = async () => {
  try {
    await api.post("/v1/auth/logout");
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    removeToken();
  }
};

/* ========================================================================= */
/* USER MANAGEMENT API ENDPOINTS                                            */
/* ========================================================================= */

/**
 * Fetch Users List
 * GET /v1/users
 * @param {Object} params - Query parameters (page, per_page, search, role, status, etc.)
 */
export const getUsersApi = async (params = {}) => {
  try {
    const response = await api.get("/v1/users", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch Single User Details by ID
 * GET /v1/users/{id}
 * @param {number|string} id 
 */
export const getUserByIdApi = async (id) => {
  try {
    const response = await api.get(`/v1/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new User
 * POST /v1/users
 * 
 * Payload:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "SecurePassword123!",
 *   "password_confirmation": "SecurePassword123!",
 *   "role": "editor",
 *   "status": "active"
 * }
 * 
 * @param {Object} data 
 */
export const createUserApi = async (data) => {
  try {
    const response = await api.post("/v1/users", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update an existing User
 * PUT /v1/users/{id}
 * @param {number|string} id 
 * @param {Object} data 
 */
export const updateUserApi = async (id, data) => {
  try {
    const response = await api.put(`/v1/users/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete a User
 * DELETE /v1/users/{id}
 * @param {number|string} id 
 */
export const deleteUserApi = async (id) => {
  try {
    const response = await api.delete(`/v1/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};