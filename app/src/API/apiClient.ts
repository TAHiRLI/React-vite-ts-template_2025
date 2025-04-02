import Cookies from "universal-cookie";
import axios from "axios";

const cookies = new Cookies();
// Function to get base URLs from localStorage
const getAdminBaseUrl = () => import.meta.env.VITE_API_URL || localStorage.getItem("adminApiBaseUrl") || "";

// Create Axios instance for Admin API
export const adminApiClient = axios.create({
  baseURL: getAdminBaseUrl(),
  timeout: 100000,
});

// Add Request Interceptors for Auth Tokens
const addAuthInterceptor = (apiClient: any) => {
  apiClient.interceptors.request.use(
    (config: any) => {
      const token = cookies.get("user")?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => Promise.reject(error)
  );

  return apiClient;
};

// Apply Interceptors
addAuthInterceptor(adminApiClient);

// Function to Update Base URLs Dynamically
export const updateAdminBaseUrl = (adminUrl: string) => {
  if (adminUrl) {
    console.log("🚀 ~ updateAdminBaseUrl ~ adminUrl:", adminUrl);
    localStorage.setItem("adminApiBaseUrl", adminUrl);
    adminApiClient.defaults.baseURL = adminUrl;
  }
};
