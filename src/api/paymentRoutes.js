import axiosInstance from "./axiosInstance";

export const getPlans = async () => {
  const { data } = await axiosInstance.get("/plans");
  return data;
};

export const createOrder = async (plan) => {
  const { data } = await axiosInstance.post("/payment/create-order", {
    plan,
  });
  return data;
};