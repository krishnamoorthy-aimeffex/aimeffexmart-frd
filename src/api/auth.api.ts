import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

export interface SignupData {
  name: string;
  email?: string;
  mobile?: string;
  password: string;
}

export interface LoginData {
  email?: string;
  mobile?: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email?: string;
    mobile?: string;
  };
}

/**
 * User Signup
 */
export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/api/auth/signup", data);
  return response.data;
};

/**
 * User Login
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/api/auth/login", data);
  return response.data;
};

/**
 * Get current user profile
 */
export const getProfile = async () => {
  const response = await apiClient.get("/api/auth/profile");
  return response.data;
};

/**
 * Logout
 */
export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default apiClient;
