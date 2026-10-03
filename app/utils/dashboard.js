import api from "./axios";

/**
 * Fetch Dashboard Statistics & Overview Data
 * GET /v1/dashboard
 */
export const getDashboardApi = async () => {
  try {
    const response = await api.get("/v1/dashboard");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getDashboardApi,
};
