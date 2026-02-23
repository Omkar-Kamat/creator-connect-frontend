import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getConversations } from "../api/messageRoutes";
import {
  setConversations,
  setLoadingConversations,
  setError,
  setOnline,
  setOffline
} from "../store/slices/chatSlice";
import { getSocket } from "../socket/socket";

const style = {
  wrapper: "min-h-screen bg-black text-white p-6",
  title: "text-2xl font-semibold mb-6",
  list: "space-y-3",
  item: "bg-gray-900 border border-gray-800 p-4 rounded-xl hover:border-gray-600 cursor-pointer transition",
  name: "font-medium",
  lastMessage: "text-sm text-gray-400 mt-1 truncate"
};

const Inbox = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { conversations, onlineUsers, loadingConversations } =
    useSelector((state) => state.chat);

  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        dispatch(setLoadingConversations(true));
        const data = await getConversations();
        dispatch(setConversations(data));
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoadingConversations(false));
      }
    };

    fetchConversations();
  }, [dispatch]);

  useEffect(() => {
    let socket;
    try {
      socket = getSocket();
    } catch (error) {
      console.error("Socket not initialized:", error);
      return;
    }

    const handleOnline = ({ userId }) => {
      dispatch(setOnline({ userId }));
    };

    const handleOffline = ({ userId }) => {
      dispatch(setOffline({ userId }));
    };

    socket.on("user:online", handleOnline);
    socket.on("user:offline", handleOffline);

    return () => {
      if (socket) {
        socket.off("user:online", handleOnline);
        socket.off("user:offline", handleOffline);
      }
    };
  }, [dispatch]);

  const openChat = (conversationId) => {
    navigate(`/chat/${conversationId}`);
  };

  if (loadingConversations) {
    return <div className={style.wrapper}>Loading...</div>;
  }

  return (
    <div className={style.wrapper}>
      <h1 className={style.title}>Inbox</h1>

      {conversations.length === 0 && (
        <div>No conversations yet.</div>
      )}

      <div className={style.list}>
        {conversations.map((conversation) => {
          const otherUser = conversation.participants.find(
            (p) => p._id !== currentUser?._id
          );

          const isOnline = onlineUsers.includes(otherUser?._id);

          return (
            <div
              key={conversation._id}
              className={style.item}
              onClick={() => openChat(conversation._id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className={style.name}>
                    {otherUser?.name}
                  </div>
                  <div className={style.lastMessage}>
                    {conversation.lastMessage || "No messages yet"}
                  </div>
                </div>

                <div
                  className={`w-3 h-3 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-gray-700"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Inbox;