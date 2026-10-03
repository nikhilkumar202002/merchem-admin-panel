import api from "./axios";
import {
  createPublicTdsRequestApi,
  getTdsRequestsApi,
} from "./tdsRequest";

export { createPublicTdsRequestApi, getTdsRequestsApi };
export const submitPublicTdsRequestApi = createPublicTdsRequestApi;

/**
 * Fetch Enquiries
 * GET /v1/enquiries?search=John&status=new
 * 
 * @param {Object} params - { search, status, page, per_page }
 */
export const getEnquiriesApi = async (params = {}) => {
  try {
    const response = await api.get("/v1/enquiries", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * View Single Enquiry Details
 * GET /v1/enquiries/{id}
 */
export const getEnquiryByIdApi = async (id) => {
  try {
    const response = await api.get(`/v1/enquiries/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update Enquiry Status
 * PATCH /v1/enquiries/{id}
 */
export const updateEnquiryStatusApi = async (id, data) => {
  try {
    const response = await api.patch(`/v1/enquiries/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete Single Enquiry
 * DELETE /v1/enquiries/{id}
 */
export const deleteEnquiryApi = async (id) => {
  try {
    const response = await api.delete(`/v1/enquiries/${id}`);
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
  getEnquiryByIdApi,
  updateEnquiryStatusApi,
  deleteEnquiryApi,
  createPublicEnquiryApi,
  getTdsRequestsApi,
};