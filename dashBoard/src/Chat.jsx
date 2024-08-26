import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("");
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found");
        return;
      }
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserId(decodedToken.national_id);

      try {
        const response = await axios.get(
          "http://localhost:4000/api/get-by-token",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCurrentUserName(response.data.user.full_name);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      const socket = io("http://localhost:4000", { query: { token } });
      socket.on("chatMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return socket;
    };

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:4000/chat/messages",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const initialize = async () => {
      const socket = await initializeUser();
      fetchMessages();

      return () => {
        socket.off("chatMessage");
      };
    };

    initialize();
  }, []);

  const sendMessage = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !currentUserId) {
      console.error("User is not authenticated");
      return;
    }

    const messageData = {
      user_id: currentUserId,
      message: newMessage,
      is_admin: false,
    };

    try {
      const socket = io("http://localhost:4000", { query: { token } });
      socket.emit("chatMessage", messageData);
      setNewMessage(""); // Clear input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <div className="flex-grow overflow-y-auto mb-4 bg-white p-4 rounded-lg shadow-md">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-2 ${
              msg.user_id === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start ${
                msg.user_id === currentUserId ? "ml-2" : "mr-2"
              }`}
            >
              <div
                className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundImage: `url(${
                    msg.user_id === currentUserId
                      ? "data:image/png;base64,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"
                      : "data:image/png;base64,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"
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* {msg.user_id === currentUserId
                  ? currentUserName.charAt(0)
                  : "U"} */}
              </div>
              <div
                className={`max-w-xs p-2 rounded-md ${
                  msg.user_id === currentUserId
                    ? "bg-blue-200 text-black"
                    : "bg-gray-200 text-black"
                }`}
              >
                <div className="flex items-center mb-1">
                  <div className="text-sm font-semibold">
                    {msg.user_id === currentUserId
                      ? `${currentUserName || "User"} (You)`
                      : `${msg.user_name || "User"}`}
                  </div>

                  <div className="ml-2 text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                {msg.message}
              </div>
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
      <div className="flex items-center mt-4">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded-r-lg p-2"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-l-lg hover:bg-blue-600"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
