import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export interface ProductFormData {
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  description: string;
  category: string;
  stock: number;
}

export interface ProductResponse {
  message: string;
  data?: {
    id: string;
    name: string;
    price: number;
    [key: string]: any;
  };
}

/**
 * Add a new product
 */
export const addProduct = async (
  data: ProductFormData
): Promise<ProductResponse> => {
  const response = await apiClient.post<ProductResponse>(
    "/products/add",
    data
  );
  return response.data;
};

/**
 * Get all products
 */
export const getAllProducts = async () => {
  const response = await apiClient.get("/products");
  return response.data;
};

/**
 * Get product count
 */
export const getProductCount = async () => {
  const response = await apiClient.get("/products/count");
  return response.data;
};

/**
 * Get product by ID
 */
export const getProductById = async (id: string) => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (category: string) => {
  const response = await apiClient.get(`/products/category/${category}`);
  return response.data;
};

/**
 * Update product
 */
export const updateProduct = async (id: string, data: ProductFormData) => {
  const response = await apiClient.put(`/products/${id}`, data);
  return response.data;
};

/**
 * Delete product
 */
export const deleteProduct = async (id: string) => {
  const response = await apiClient.delete(`/products/${id}`);
  return response.data;
};

export default apiClient;