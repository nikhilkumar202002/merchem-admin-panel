import api from "./axios";

/**
 * =========================================================================
 * USER MANAGEMENT API ENDPOINTS
 * =========================================================================
 */

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
 * Payload Example:
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

export default {
  getUsersApi,
  getUserByIdApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
};
