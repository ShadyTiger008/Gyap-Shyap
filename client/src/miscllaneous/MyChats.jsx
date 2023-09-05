import React, { useEffect, useState } from "react";
import { useChatState } from "../Context/ChatProvider";
import axios from "axios";
import { getSender } from "../config/chatLogics";

const MyChats = ({ showChat, setShowChat, fetchAgain }) => {
  const { user, setSelectedChat, chats, setChats } = useChatState();
  const [ loggedsUser, setLoggedUser ] = useState();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.get("/api/chat", config);
      console.log(data);
      setChats(data);
    } catch (error) {
      alert("Failed to load the chats");
      console.log("Error : ", error);
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  const handleChatClick = (chat) => {
    setSelectedChat(chat); // Set the selected chat when a chat is clicked
  };

  return (
    <section
      className={
        !showChat
          ? "w-[95vw] text-white p-5 justify-center items-center"
          : "w-[22vw] text-white p-5 justify-center items-center"
      }>
      <h1 className="text-3xl text-center">My Chats</h1>
      <div
        className={
          !showChat
            ? `flex flex-row flex-wrap mt-10 space-x-4 space-y-4   justify-center items-center`
            : `flex flex-col w-full mt-10 space-y-6 justify-center items-center`
        }>
        {chats &&
          chats?.map((chat) => {
            return (
              <div
                key={chat._id}
                className={
                  !showChat
                    ? `w-[40%] h-16 bg-[#202329] rounded-xl cursor-pointer justify-start items-center flex px-5`
                    : `w-[100%] h-16  bg-[#202329] rounded-xl cursor-pointer justify-start items-center flex px-5`
                }
                onClick={() => handleChatClick(chat)} // Pass the chat to the click handler
              >
                <p>
                  {!chat.isGroupChat
                    ? getSender(loggedsUser, chat.users)
                    : chat.chatName}
                </p>
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default MyChats;
