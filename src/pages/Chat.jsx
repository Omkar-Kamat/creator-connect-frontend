import { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getMessages, getConversations } from "../api/messageRoutes";
import {
    setMessages,
    addMessage,
    setTyping,
    markConversationSeen,
    setLoadingMessages,
    setConversations,
} from "../store/slices/chatSlice";
import { getSocket } from "../socket/socket";

const style = {
    wrapper:
        "h-[calc(100vh-120px)] bg-black text-white flex flex-col overflow-hidden",
    header: "text-2xl font-semibold p-6 border-b border-gray-800",
    messagesContainer: "flex-1 overflow-y-auto px-6 py-4 space-y-3",
    bubble: "max-w-[70%] p-3 rounded-xl text-sm break-words",
    sent: "bg-blue-600 text-white",
    received: "bg-gray-800 text-white",
    inputWrapper: "flex gap-3 p-6 border-t border-gray-800 bg-black",
    input: "flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none",
    button: "bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition font-medium text-center",
};

const Chat = () => {
    const { conversationId } = useParams();
    const dispatch = useDispatch();
    const bottomRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const [socketError, setSocketError] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                const socketInstance = getSocket();
                setSocket(socketInstance);
                console.log("Socket set in Chat component");
            } catch (error) {
                console.error("Socket not initialized:", error);
                setSocketError(true);
            }
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);

    const { messages, typingUsers, conversations, loadingMessages } =
        useSelector((state) => state.chat);

    const currentUser = useSelector((state) => state.auth.user);

    const conversation = useMemo(
        () => {
            const conv = conversations.find((c) => c._id === conversationId);
            console.log("Conversation found:", conv);
            return conv;
        },
        [conversations, conversationId],
    );

    const otherUser = useMemo(
        () => {
            const other = conversation?.participants.find((p) => p._id !== currentUser?._id);
            console.log("Other user:", other);
            return other;
        },
        [conversation, currentUser],
    );

    const conversationMessages = useMemo(
        () => messages[conversationId] || [],
        [messages, conversationId],
    );

    const isOtherTyping = useMemo(
        () => otherUser && typingUsers[otherUser._id],
        [typingUsers, otherUser],
    );

    const [text, setText] = useState("");

    /* Load Messages */
    useEffect(() => {
        const fetchData = async () => {
            dispatch(setLoadingMessages(true));
            const [convos, msgs] = await Promise.all([
                getConversations(),
                getMessages(conversationId)
            ]);
            dispatch(setConversations(convos));
            dispatch(setMessages({ conversationId, messages: msgs }));
            dispatch(setLoadingMessages(false));

            if (socket && otherUser?._id) {
                socket.emit("chat:seen", {
                    conversationId,
                    senderId: otherUser._id,
                });
                dispatch(markConversationSeen({ conversationId }));
            }
        };

        if (conversationId) fetchData();
    }, [conversationId, dispatch]);

    /* Socket Listeners */
    useEffect(() => {
        const handleSocketError = () =>{setSocketError(true);}
        if (!socket) {
            handleSocketError()
            return;
        }

        const handleReceive = (message) => {
            if (message.conversation !== conversationId) return;

            dispatch(addMessage(message));

            if (message.receiver === currentUser._id) {
                socket.emit("chat:seen", {
                    conversationId,
                    senderId: message.sender,
                });
                dispatch(markConversationSeen({ conversationId }));
            }
        };

        const handleSent = (message) => {
            if (message.conversation !== conversationId) return;
            dispatch(addMessage(message));
        };

        const handleTyping = ({ userId }) => {
            dispatch(setTyping({ userId, isTyping: true }));
        };

        const handleStopTyping = ({ userId }) => {
            dispatch(setTyping({ userId, isTyping: false }));
        };

        socket.on("chat:receive", handleReceive);
        socket.on("chat:sent", handleSent);
        socket.on("chat:typing", handleTyping);
        socket.on("chat:stopTyping", handleStopTyping);

        return () => {
            socket.off("chat:receive", handleReceive);
            socket.off("chat:sent", handleSent);
            socket.off("chat:typing", handleTyping);
            socket.off("chat:stopTyping", handleStopTyping);
        };
    }, [conversationId, dispatch, currentUser, socket]);

    /* Auto Scroll */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversationMessages]);

    /* Cleanup typing timeout */
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    /* Send Message */
    const sendMessage = () => {
        console.log("sendMessage called", { text, otherUser, socket });
        if (!text.trim() || !otherUser?._id || !socket) {
            console.log("Send blocked:", { hasText: !!text.trim(), hasOtherUser: !!otherUser?._id, hasSocket: !!socket });
            return;
        }

        console.log("Sending message:", {
            conversationId,
            receiverId: otherUser._id,
            text,
            socketConnected: socket.connected,
            socketAuthenticated: socket.isAuthenticated
        });

        socket.emit("chat:send", {
            conversationId,
            receiverId: otherUser._id,
            text,
        });

        setText("");
    };

    /* Typing */
    const handleTypingChange = (value) => {
        setText(value);

        if (!otherUser?._id || !socket) return;

        socket.emit("chat:typing", {
            receiverId: otherUser._id,
        });

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            if (socket) {
                socket.emit("chat:stopTyping", {
                    receiverId: otherUser._id,
                });
            }
        }, 800);
    };

    if (loadingMessages) {
        return <div className={style.wrapper}>Loading...</div>;
    }

    if (!socket) {
        return <div className={style.wrapper}>Connecting...</div>;
    }

    return (
        <div className={style.wrapper}>
            <div className={style.header}>{otherUser?.name || "Chat"}</div>

            <div className={style.messagesContainer}>
                {conversationMessages.map((msg) => {
                    const isOwn = msg.sender === currentUser._id;

                    return (
                        <div
                            key={msg._id}
                            className={`flex ${
                                isOwn ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`${style.bubble} ${
                                    isOwn ? style.sent : style.received
                                }`}
                            >
                                <div>{msg.text}</div>
                                {isOwn && (
                                    <div className="text-xs mt-1 text-right opacity-70">
                                        {msg.status}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {isOtherTyping && (
                    <div className="text-sm text-gray-400">
                        {otherUser?.name} is typing...
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            <div className={style.inputWrapper}>
                <textarea
                    value={text}
                    onChange={(e) => handleTypingChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    rows={1}
                    className={`${style.input} resize-none`}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage} className={style.button}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
