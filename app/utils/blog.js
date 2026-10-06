import api from "./axios";

/**
 * Fetch all blogs (Paginated & Filterable)
 * GET /v1/blogs?search=rubber&status=published&page=1&per_page=20
 * 
 * @param {Object} params - Query params (search, status, page, per_page)
 * @returns {Promise<Object>} { success, message, data: [...], meta: { current_page, per_page, total, last_page } }
 */
export const getBlogsApi = async (params = {}) => {
  try {
    const response = await api.get("/v1/blogs", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch single blog by ID
 * GET /v1/blogs/{id}
 * 
 * @param {number|string} id - Blog ID
 * @returns {Promise<Object>} { success, message, data: { ...blogDetails } }
 */
export const getBlogByIdApi = async (id) => {
  try {
    const response = await api.get(`/v1/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new blog
 * POST /v1/blogs
 * 
 * @param {Object|FormData} data - Blog data payload (title, slug, excerpt, content, status, featured_image, etc.)
 * @returns {Promise<Object>} { success, message, data: { ...createdBlog } }
 */
export const createBlogApi = async (data) => {
  try {
    const response = await api.post("/v1/blogs", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update an existing blog
 * PATCH /v1/blogs/{id} (or POST /v1/blogs/{id} with _method=PATCH for FormData)
 * 
 * @param {number|string} id - Blog ID
 * @param {Object|FormData} data - Updated blog data
 * @returns {Promise<Object>} { success, message, data: { ...updatedBlog } }
 */
export const updateBlogApi = async (id, data) => {
  try {
    let response;
    // For FormData uploads, append _method=PATCH and use POST for multipart compatibility
    if (data instanceof FormData) {
      if (!data.has("_method")) {
        data.append("_method", "PATCH");
      }
      response = await api.post(`/v1/blogs/${id}`, data);
    } else {
      response = await api.patch(`/v1/blogs/${id}`, data);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete a blog by ID
 * DELETE /v1/blogs/{id}
 * 
 * @param {number|string} id - Blog ID
 * @returns {Promise<Object>} { success, message }
 */
export const deleteBlogApi = async (id) => {
  try {
    const response = await api.delete(`/v1/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const blogService = {
  getBlogsApi,
  getBlogByIdApi,
  createBlogApi,
  updateBlogApi,
  deleteBlogApi,
};

export default blogService;