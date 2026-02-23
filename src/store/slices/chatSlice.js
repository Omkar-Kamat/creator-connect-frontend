import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  activeConversationId: null,
  messages: {},
  typingUsers: {},
  onlineUsers: [],
  loadingConversations: false,
  loadingMessages: false,
  error: null
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {

    setConversations(state, action) {
      state.conversations = action.payload;
    },

    addConversation(state, action) {
      const exists = state.conversations.find(
        (c) => c._id === action.payload._id
      );
      if (!exists) {
        state.conversations.unshift(action.payload);
      }
    },

    setActiveConversation(state, action) {
      state.activeConversationId = action.payload;
    },

    setMessages(state, action) {
      const { conversationId, messages } = action.payload;
      state.messages[conversationId] = messages;
    },

    addMessage(state, action) {
      const message = action.payload;
      const conversationId = message.conversation;

      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }

      state.messages[conversationId].push(message);

      const conversation = state.conversations.find(
        (c) => c._id === conversationId
      );

      if (conversation) {
        conversation.lastMessage = message.text;
      }
    },

    updateMessageStatus(state, action) {
      const { conversationId, messageId, status } = action.payload;

      const messages = state.messages[conversationId];
      if (!messages) return;

      const message = messages.find((m) => m._id === messageId);
      if (message) {
        message.status = status;
      }
    },

    markConversationSeen(state, action) {
      const { conversationId } = action.payload;

      const messages = state.messages[conversationId];
      if (!messages) return;

      messages.forEach((msg) => {
        if (msg.status === "sent" || msg.status === "delivered") {
          msg.status = "seen";
        }
      });
    },

    setTyping(state, action) {
      const { userId, isTyping } = action.payload;

      if (isTyping) {
        state.typingUsers[userId] = true;
      } else {
        delete state.typingUsers[userId];
      }
    },

    setOnline(state, action) {
      const { userId } = action.payload;

      if (!state.onlineUsers.includes(userId)) {
        state.onlineUsers.push(userId);
      }
    },

    setOffline(state, action) {
      const { userId } = action.payload;
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== userId
      );
    },

    setLoadingConversations(state, action) {
      state.loadingConversations = action.payload;
    },

    setLoadingMessages(state, action) {
      state.loadingMessages = action.payload;
    },

    setError(state, action) {
      state.error = action.payload;
    },

    clearChatState() {
      return initialState;
    }
  }
});

export const {
  setConversations,
  addConversation,
  setActiveConversation,
  setMessages,
  addMessage,
  updateMessageStatus,
  markConversationSeen,
  setTyping,
  setOnline,
  setOffline,
  setLoadingConversations,
  setLoadingMessages,
  setError,
  clearChatState
} = chatSlice.actions;

export default chatSlice.reducer;