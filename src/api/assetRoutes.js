import axiosInstance from "./axiosInstance";

export const createAsset = async (formData) => {
    try {
        const res = await axiosInstance.post("/assets", formData);

        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getPublicAssets = async (params = {}) => {
    try {
        const res = await axiosInstance.get("/assets", {
            params,
        });

        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getMyAssets = async (params = {}) => {
    try {
        const res = await axiosInstance.get("/assets/my", {
            params,
        });

        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
