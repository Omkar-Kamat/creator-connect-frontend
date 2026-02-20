import axiosInstance from "./axiosInstance";

export const signupUser = async (data) => {
    try {
        const res = await axiosInstance.post("/auth/signup", data);

        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const loginUser = async (data) => {
    try {
        const res = await axiosInstance.post("/auth/login", data);

        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getCurrentUser = async () => {
    try {
        const res = await axiosInstance.get("/auth/me");

        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const logoutUser = async () => {
    try {
        const res = await axiosInstance.post("/auth/logout");

        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const sendOtp = async (data) => {
    try {
        const res = await axiosInstance.post("/auth/send-otp", data);

        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const verifyOtp = async (data) => {
    try {
        const res = await axiosInstance.post("/auth/verify-otp", data);

        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
