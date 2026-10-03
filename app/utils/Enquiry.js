import api from "./axios";
import { createPublicTdsRequestApi, getTdsRequestsApi } from "./tdsRequest";

/**
 * =========================================================================
 * ENQUIRY & PUBLIC REQUEST API ENDPOINTS
 * =========================================================================
 */

/**
 * Submit Public TDS Request
 * POST /v1/public/tds-requests
 * 
 * Payload:
 * {
 *   "product_id": 24,
 *   "name": "John Mathew",
 *   "company_name": "ABC Rubber Pvt Ltd",
 *   "email": "john@abcrubber.com",
 *   "phone": "+91 9876543210",
 *   "location": "Kochi, India",
 *   "message": "Please share the latest TDS document."
 * }
 */
export const createPublicTdsRequestApi = createPublicTdsRequestApi;
export const submitPublicTdsRequestApi = createPublicTdsRequestApi;

/**
 * Fetch Enquiries / TDS Requests
 * GET /v1/tds-requests
 */
export const getEnquiriesApi = async (params = {}) => {
  try {
    const response = await api.get("/v1/tds-requests", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Submit General Contact / Product Enquiry
 * POST /v1/public/enquiries
 * @param {Object} data 
 */
export const createPublicEnquiryApi = async (data) => {
  try {
    const response = await api.post("/v1/public/enquiries", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  createPublicTdsRequestApi,
  submitPublicTdsRequestApi,
  getEnquiriesApi,
  createPublicEnquiryApi,
  getTdsRequestsApi,
};