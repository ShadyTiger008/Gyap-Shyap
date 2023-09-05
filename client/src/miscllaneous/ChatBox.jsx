import React from "react";
import { useChatState } from "../Context/ChatProvider";
import SingleChat from "../Sub Components/SingleChat";

const ChatBox = ({ showChat, user, fetchAgain, setFetchAgain, setToggleSenderProfile, toggleSenderProfile }) => {
  const { selectedChat, setSelectedChat } = useChatState();
  return (
    showChat && (
      <section className="w-[70vw] min-h-screen bg-[#202329] text-white p-5 space-y-4 rounded-2xl">
        {!selectedChat ? (
          <div className="w-full h-full flex justify-center items-center">
            <p>Click on a user to start chatting</p>
          </div>
        ) : (
          <SingleChat
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
            setToggleSenderProfile={setToggleSenderProfile}
            toggleSenderProfile={toggleSenderProfile}
          />
        )}
      </section>
    )
  );
};

export default ChatBox;
