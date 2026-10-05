import api from "./axios";

/* ========================================================================= */
/* 1. PRODUCT MAIN CATEGORIES API ENDPOINTS                                 */
/* ========================================================================= */

/**
 * Fetch Product Main Categories
 * GET /v1/product-categories
 * @param {Object} params - Query parameters (page, per_page, search, status, etc.)
 */
export const getProductCategoriesApi = async (params = {}) => {
  try {
    const response = await api.get("/v1/product-categories", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch single Product Main Category by ID
 * GET /v1/product-categories/{id}
 * @param {number|string} id 
 */
export const getProductCategoryByIdApi = async (id) => {
  try {
    const response = await api.get(`/v1/product-categories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new Product Main Category
 * POST /v1/product-categories
 * @param {FormData|Object} data 
 */
export const createProductCategoryApi = async (data) => {
  try {
    let payload = data;

    if (!(data instanceof FormData)) {
      payload = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
          payload.append(key, data[key]);
        }
      });
    }

    const response = await api.post("/v1/product-categories", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update an existing Product Main Category
 * POST /v1/product-categories/{id}
 * @param {number|string} id 
 * @param {FormData|Object} data 
 */
export const updateProductCategoryApi = async (id, data) => {
  try {
    let payload = data;

    if (data instanceof FormData) {
      if (!payload.has("_method")) {
        payload.append("_method", "PUT");
      }
    } else {
      payload = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
          payload.append(key, data[key]);
        }
      });
      payload.append("_method", "PUT");
    }

    const response = await api.post(`/v1/product-categories/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete a Product Main Category
 * DELETE /v1/product-categories/{id}
 * @param {number|string} id 
 */
export const deleteProductCategoryApi = async (id) => {
  try {
    const response = await api.delete(`/v1/product-categories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/* ========================================================================= */
/* 2. PRODUCT SUBCATEGORIES API ENDPOINTS                                    */
/* ========================================================================= */

/**
 * Fetch Product Subcategories
 * GET /v1/product-subcategories
 * @param {Object} params - Query parameters (category_id, search, status, page, per_page, etc.)
 */
export const getProductSubcategoriesApi = async (params = {}) => {
  try {
    const response = await api.get("/v1/product-subcategories", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch single Product Subcategory by ID
 * GET /v1/product-subcategories/{id}
 * @param {number|string} id 
 */
export const getProductSubcategoryByIdApi = async (id) => {
  try {
    const response = await api.get(`/v1/product-subcategories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new Product Subcategory
 * POST /v1/product-subcategories
 * @param {FormData|Object} data 
 */
export const createProductSubcategoryApi = async (data) => {
  try {
    let payload = data;
    if (!(data instanceof FormData)) {
      payload = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
          payload.append(key, data[key]);
        }
      });
    }

    const response = await api.post("/v1/product-subcategories", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update an existing Product Subcategory
 * PUT /v1/product-subcategories/{id} or POST with _method PUT
 * @param {number|string} id 
 * @param {FormData|Object} data 
 */
export const updateProductSubcategoryApi = async (id, data) => {
  try {
    let payload = data;
    if (data instanceof FormData) {
      payload = data;
      if (!payload.has("_method")) {
        payload.append("_method", "PUT");
      }
    } else {
      payload = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
          payload.append(key, data[key]);
        }
      });
      payload.append("_method", "PUT");
    }

    const response = await api.post(`/v1/product-subcategories/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete a Product Subcategory
 * DELETE /v1/product-subcategories/{id}
 * @param {number|string} id 
 */
export const deleteProductSubcategoryApi = async (id) => {
  try {
    const response = await api.delete(`/v1/product-subcategories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/* ========================================================================= */
/* 3. PRODUCTS API ENDPOINTS                                                 */
/* ========================================================================= */

/**
 * Fetch Products List
 * GET /v1/products
 * @param {Object} params - (search, category_id, subcategory_id, status, sort_by, sort_order, page, per_page)
 */
export const getProductsApi = async (params = {}) => {
  try {
    const response = await api.get("/v1/products", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch Single Product Details by ID
 * GET /v1/products/{id}
 * @param {number|string} id 
 */
export const getProductByIdApi = async (id) => {
  try {
    const response = await api.get(`/v1/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new Chemical Product
 * POST /v1/products (multipart/form-data)
 * @param {FormData|Object} data 
 */
export const createProductApi = async (data) => {
  try {
    let payload = data;
    if (!(data instanceof FormData)) {
      payload = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
          payload.append(key, data[key]);
        }
      });
    }

    const response = await api.post("/v1/products", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update an existing Chemical Product
 * POST /v1/products/{id} (with _method: PUT for multipart/form-data)
 * @param {number|string} id 
 * @param {FormData|Object} data 
 */
export const updateProductApi = async (id, data) => {
  try {
    let payload = data;

    if (data instanceof FormData) {
      if (!payload.has("_method")) {
        payload.append("_method", "PUT");
      }
    } else {
      payload = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
          payload.append(key, data[key]);
        }
      });
      payload.append("_method", "PUT");
    }

    const response = await api.post(`/v1/products/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete a Chemical Product
 * DELETE /v1/products/{id}
 * @param {number|string} id 
 */
export const deleteProductApi = async (id) => {
  try {
    const response = await api.delete(`/v1/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/* ========================================================================= */
/* 4. PRODUCT TDS DOCUMENT API ENDPOINTS                                     */
/* ========================================================================= */

/**
 * Upload TDS Document for a Product
 * POST /v1/products/{id}/tds (multipart/form-data)
 * @param {number|string} productId 
 * @param {FormData|Object} data - { version: "1.0", tds_document: File }
 */
export const uploadProductTdsApi = async (productId, data) => {
  try {
    let payload = data;

    if (!(data instanceof FormData)) {
      payload = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
          payload.append(key, data[key]);
        }
      });
    }

    const response = await api.post(`/v1/products/${productId}/tds`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete TDS Document for a Product
 * DELETE /v1/products/{id}/tds
 * @param {number|string} productId 
 */
export const deleteProductTdsApi = async (productId) => {
  try {
    const response = await api.delete(`/v1/products/${productId}/tds`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Formats image or document storage URLs cleanly to full HTTPS URLs.
 * Handles null/undefined, relative paths, storage/ prefixes, and localhost/127.0.0.1 replacement.
 */
export const formatStorageUrl = (rawUrlOrPath) => {
  if (!rawUrlOrPath) return null;
  let path = String(rawUrlOrPath).trim();
  if (!path) return null;

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.merchem.com/api";
  const domainOrigin = apiBase.replace(/\/api\/?$/, "");

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path.replace(/^(https?:\/\/[^\/]+)/, domainOrigin);
  }

  path = path.replace(/^\/+/, "");

  if (path.startsWith("storage/")) {
    return `${domainOrigin}/${path}`;
  }

  return `${domainOrigin}/storage/${path}`;
};