import axios from "axios";
import { errorToast } from "../utils/toast";

const axiosInstance = axios.create({
    baseURL: "https://creators-connect-backend.onrender.com/api/",
    withCredentials: true,
    timeout: 15000,
});

axiosInstance.interceptors.response.use(
    (response) => response,

    (error) => {
        const status = error.response?.status;
        const message =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";

        if (status === 401) {
            errorToast("Session expired. Please login again.");

            window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        } else {
            errorToast(message);
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
