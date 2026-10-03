import api from "./axios";

/* ========================================================================= */
/* NOTIFICATION SYSTEM API ENDPOINTS                                         */
/* ========================================================================= */

/**
 * Fetch All Notifications
 * GET /v1/notifications
 * @param {Object} params - Query parameters (page, per_page, unread_only, etc.)
 */
export const getNotificationsApi = async (params = {}) => {
  try {
    const response = await api.get("/v1/notifications", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch Unread Notifications Count
 * GET /v1/notifications/unread-count
 */
export const getUnreadNotificationsCountApi = async () => {
  try {
    const response = await api.get("/v1/notifications/unread-count");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Mark Single Notification as Read
 * PATCH /v1/notifications/{id}/read
 * @param {number|string} id 
 */
export const markNotificationAsReadApi = async (id) => {
  try {
    const response = await api.patch(`/v1/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Mark All Notifications as Read
 * PATCH /v1/notifications/read-all
 */
export const markAllNotificationsAsReadApi = async () => {
  try {
    const response = await api.patch("/v1/notifications/read-all");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete Single Notification
 * DELETE /v1/notifications/{id}
 * @param {number|string} id 
 */
export const deleteNotificationApi = async (id) => {
  try {
    const response = await api.delete(`/v1/notifications/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
