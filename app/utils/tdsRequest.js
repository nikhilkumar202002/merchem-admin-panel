import api from "./axios";

/**
 * =========================================================================
 * PUBLIC & ADMIN TDS REQUEST API ENDPOINTS
 * =========================================================================
 */

/**
 * Submit a Public TDS Request
 * POST /v1/public/tds-requests
 * 
 * Payload Example:
 * {
 *   "product_id": 24,
 *   "name": "John Mathew",
 *   "company_name": "ABC Rubber Pvt Ltd",
 *   "email": "john@abcrubber.com",
 *   "phone": "+91 9876543210",
 *   "location": "Kochi, India",
 *   "message": "Please share the latest TDS document."
 * }
 * 
 * @param {Object} data
 * @param {number|string} data.product_id - Associated Product ID
 * @param {string} data.name - Requestor's full name
 * @param {string} [data.company_name] - Requestor's company name
 * @param {string} data.email - Requestor's email address
 * @param {string} [data.phone] - Requestor's phone number
 * @param {string} [data.location] - Requestor's location (city/country)
 * @param {string} [data.message] - Message/Notes
 * @returns {Promise<Object>} API response data
 */
export const createPublicTdsRequestApi = async (data) => {
  try {
    const payload = {
      product_id: data.product_id,
      name: data.name,
      company_name: data.company_name || data.company || "",
      email: data.email,
      phone: data.phone || "",
      location: data.location || "",
      message: data.message || "",
    };

    const response = await api.post("/v1/public/tds-requests", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Alias for createPublicTdsRequestApi
 */
export const submitPublicTdsRequestApi = createPublicTdsRequestApi;

/**
 * Fetch All TDS Requests (Admin)
 * GET /v1/tds-requests
 * @param {Object} params - Query parameters (search, status, product_id, page, per_page)
 */
export const getTdsRequestsApi = async (params = {}) => {
  try {
    const response = await api.get("/v1/tds-requests", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch Single TDS Request by ID (Admin)
 * GET /v1/tds-requests/{id}
 * @param {number|string} id 
 */
export const getTdsRequestByIdApi = async (id) => {
  try {
    const response = await api.get(`/v1/tds-requests/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update TDS Request Status (Admin)
 * PATCH /v1/tds-requests/{id}/status
 * @param {number|string} id 
 * @param {string} status - ("Pending" | "Sending" | "Sent" | "Failed")
 */
export const updateTdsRequestStatusApi = async (id, status) => {
  try {
    const response = await api.patch(`/v1/tds-requests/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Send TDS Document Email to Customer (Admin Send)
 * POST /v1/tds-requests/{id}/send
 * @param {number|string} id 
 */
export const sendTdsRequestApi = async (id) => {
  try {
    const response = await api.post(`/v1/tds-requests/${id}/send`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Alias for sendTdsRequestApi
 */
export const sendTdsRequestEmailApi = sendTdsRequestApi;

/**
 * Delete TDS Request (Admin)
 * DELETE /v1/tds-requests/{id}
 * @param {number|string} id 
 */
export const deleteTdsRequestApi = async (id) => {
  try {
    const response = await api.delete(`/v1/tds-requests/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
