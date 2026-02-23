import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  withCredentials: true,
  timeout: 10000
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        message: "Network error. Server unreachable."
      });
    }

    return Promise.reject(error.response.data);
  }
);

export default axiosInstance;