// api/message.api.js
import axiosInstance from "./axiosInstance";

export const createConversation = async (receiverId) => {
  const { data } = await axiosInstance.post(
    "/chat/conversation",
    { receiverId }
  );
  return data.data;
};

export const getConversations = async () => {
  const { data } = await axiosInstance.get(
    "/chat/conversation"
  );
  return data.data;
};

export const getMessages = async (conversationId) => {
  const { data } = await axiosInstance.get(
    `/chat/conversation/${conversationId}/messages`
  );
  return data.data;
};

export const sendMessageREST = async (payload) => {
  const { data } = await axiosInstance.post(
    "/chat/message",
    payload
  );
  return data.data;
};