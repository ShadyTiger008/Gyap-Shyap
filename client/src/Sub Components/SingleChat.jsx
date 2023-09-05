import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useChatState } from "../Context/ChatProvider";
import { BsSun, BsSend } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import {
  getSender,
  getSenderFull,
  isLastMessage,
  isSameSender,
  isSameUser,
  isSameSenderMargin
} from "../config/chatLogics";
import SenderProfile from "../User Items/SenderProfile";
import axios from "axios";
import ScrollableFeed from "react-scrollable-feed";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({
  fetchAgain,
  setFetchAgain,
  toggleSenderProfile,
  setToggleSenderProfile
}) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    useChatState();
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    // Logic to fetch messages for the selected chat
    // You can use Axios or any other method here
    // and update the messages state
  }, [selectedChat]);

  

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    socket.on("typing", () => setTyping(true));
    socket.on("stop typing", () => setTyping(false));
  }, [socket]);

  const handleToggleSenderProfile = () => {
    setToggleSenderProfile(!toggleSenderProfile);
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      alert("Failed to load the messages");
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (message) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== message.chat._id
      ) {
        // Give Notification
        if (!notification.includes(message)) {
          setNotification([message, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, message]);
      }
    });
  });

  const sendMessage = async () => {
    if (!newMessage.trim()) return; // Don't send empty messages
    socket.emit("stop typing", selectedChat._id);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      };

      setNewMessage("");

      const { data } = await axios.post(
        "/api/message",
        {
          content: newMessage,
          chatId: selectedChat._id
        },
        config
      );
      socket.emit("sendMessage", data);
      // setMessages([...messages, data]);
      console.log(messages);
    } catch (error) {
      alert("Failed to send the message");
      console.error("Error: ", error);
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected || !selectedChat) {
      return;
    }

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTyping = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTyping;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
        console.log("Stopped typing");
      }
    }, timerLength);

    // Check if the typing event is from the other person in the chat
    if (selectedChat && selectedChat.users && selectedChat.users.length === 2) {
      const otherPersonId = selectedChat.users.find(
        (chatUser) => chatUser._id !== user._id
      );

      if (e.target.value && e.target.value.length > 0) {
        // Notify the other person
        socket.emit("typing", otherPersonId);
      } else {
        // Notify the other person that typing stopped
        socket.emit("stop typing", otherPersonId);
      }
    }
  };

  useLayoutEffect(() => {
    // Scroll to the end of the message container when messages change
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main className="max-h-screen h-full space-y-4">
      <div className="flex flex-row justify-between items-center">
        <div className="text-2xl flex flex-col">
          {selectedChat.isGroupChat ? (
            <>{selectedChat.chatName.toUpperCase()}</>
          ) : (
            <>{getSender(user, selectedChat.users)}</>
          )}
          <span className="text-sm">Online 24mins ago</span>
        </div>
        <div className="flex flex-row items-center space-x-10">
          <BsSun size={30} />
          <div
            className="flex flex-row space-x-4 justify-center items-center bg-[#161719] px-5 py-2 rounded-xl cursor-pointer"
            onClick={handleToggleSenderProfile}>
            {user ? (
              <img
                src={getSenderFull(user, selectedChat.users).pic}
                alt=""
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-white"></div>
            )}
            <FaEye size={25} />
          </div>
        </div>
      </div>
      <div
        className="w-full h-[75%] bg-[#161719] rounded-3xl p-5"
        ref={messageContainerRef}>
        {loading ? (
          <div className="w-full h-full justify-center items-center flex">
            <p>loading...</p>
          </div>
        ) : (
          <div className="h-full overflow-y-scroll">
            {messages &&
              messages.map((message, index) => {
                const sameSenderMargin = isSameSenderMargin(
                  messages,
                  message,
                  index,
                  user._id
                );

                const isCurrentUser = message.sender._id === user._id;

                const messageContainerStyle = {
                  marginTop: sameSenderMargin,
                  display: "flex",
                  justifyContent: isCurrentUser ? "flex-end" : "flex-start"
                };

                return (
                  <div
                    key={message._id}
                    style={messageContainerStyle}
                    className="mb-2">
                    {isCurrentUser ? (
                      <div className="flex flex-row items-center justify-end space-x-4">
                        <span className="text-white bg-emerald-500 p-2 rounded-l-lg rounded-tr-lg">
                          {message.content}
                        </span>
                        <img
                          src={message.sender.pic}
                          alt=""
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-row items-center justify-start space-x-4">
                        <img
                          src={message.sender.pic}
                          alt=""
                          className="w-10 h-10 rounded-full"
                        />
                        <span className="text-white bg-indigo-400 p-2 rounded-r-lg rounded-tl-lg">
                          {message.content}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>

      <div className="w-full h-[8%] bg-[#161719] rounded-xl flex flex-row items-center justify-between px-10">
        {showTypingIndicator && typing ? (
          <div className="w-full h-full text-6xl text-white">Typing ...</div>
        ) : (
          <></>
        )}
        <input
          placeholder="Type your message"
          className="bg-[#161719] outline-none w-full"
          value={newMessage}
          onChange={typingHandler}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <BsSend onClick={sendMessage} className="cursor-pointer1" />
      </div>
    </main>
  );
};

export default SingleChat;
