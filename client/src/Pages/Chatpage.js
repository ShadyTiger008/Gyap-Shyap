import React, { useEffect, useState } from "react";
import { useChatState } from "../Context/ChatProvider";
import SideDrawer from "../miscllaneous/SideDrawer";
import MyChats from "../miscllaneous/MyChats";
import ChatBox from "../miscllaneous/ChatBox";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiSearchAlt } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { PiSignOutBold } from "react-icons/pi";
import { BsSun, BsSend } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import UserProfile from "../User Items/UserProfile";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CreateGroup from "../miscllaneous/CreateGroup";
import SenderProfile from "../User Items/SenderProfile";
import { getSenderFull } from "../config/chatLogics";
import GroupChatModel from "../Sub Components/GroupChatModel";
import { RxCross2 } from "react-icons/rx";

const Chatpage = () => {
  const navigate = useNavigate();
  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification
  } = useChatState();
  const [toggleSearch, setToggleSearch] = useState(false);
  const [toggleUserModal, setToggleUserModal] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [loggedsUser, setLoggedUser] = useState();
  const [createGroup, setCreateGroup] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [toggleSenderProfile, setToggleSenderProfile] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const fetchChats = async () => {
    try {
      if (user && user.token) {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        const { data } = await axios.get("/api/chat", config);
        console.log(data);
        setChats(data);
      } else {
        // Handle the case where user or token is not available
        alert("User or token is missing");
      }
    } catch (error) {
      alert("Failed to load the chats");
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    // Fetch user data and set in the user state
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));

    // Call fetchChats after user data is set
    if (user && user.token) {
      fetchChats();
    }
  }, [user]);
  return (
    <main className="min-w-screen min-h-screen bg-[#161719] flex flex-row">
      {/* Right Section */}
      <section className="w-[8vw] text-center text-white text-5xl font-bold py-10 flex flex-col justify-between items-center">
        <h1>GS</h1>
        {/* Middle Icons */}
        <div className="flex flex-col space-y-6">
          <button
            className="flex flex-col items-center space-y-2"
            onClick={() => {
              setShowNotification(!showNotification);
            }}>
            <IoMdNotificationsOutline size={40} />
            <span className="text-xs">Notifications</span>
          </button>
          <button
            className="flex flex-col items-center space-y-2"
            onClick={() => setToggleSearch(true)}>
            <BiSearchAlt size={40} />
            <span className="text-xs">Search User</span>
          </button>
          <button
            className="flex flex-col items-center space-y-2"
            onClick={() => setCreateGroup(true)}>
            <AiOutlinePlus size={40} />
            <span className="text-xs">New Group</span>
          </button>
        </div>

        {/* Profile and Logout icons  */}
        <div className="flex flex-col items-center space-y-4">
          <button
            className="flex flex-col space-y-2"
            onClick={() => {
              setToggleUserModal(true);
            }}>
            {user ? (
              <img src={user.pic} alt="" className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 bg-white"></div>
            )}
            <span className="text-xs">Profile</span>
          </button>
          <button
            className="flex flex-col items-center space-y-2"
            onClick={handleLogout}>
            <PiSignOutBold size={40} />
            <span className="text-xs">Log Out</span>
          </button>
        </div>
        {/* Search User Section */}
        <SideDrawer
          toggleSearch={toggleSearch}
          setToggleSearch={setToggleSearch}
        />
      </section>

      {/* Middle chats section */}
      <ChatBox
        showChat={showChat}
        user={user}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
        toggleSenderProfile={toggleSenderProfile}
        setToggleSenderProfile={setToggleSenderProfile}
      />
      {/* My Chats Section  */}
      <MyChats
        showChat={showChat}
        setShowChat={setShowChat}
        fetchAgain={fetchAgain}
      />
      {toggleUserModal && (
        <UserProfile
          toggleUserModal={toggleUserModal}
          setToggleUserModal={setToggleUserModal}
          user={user}
        />
      )}
      {toggleSenderProfile && !selectedChat.isGroupChat && (
        <SenderProfile
          user={getSenderFull(user, selectedChat.users)}
          setToggleSenderProfile={setToggleSenderProfile}
        />
      )}
      {toggleSenderProfile && selectedChat.isGroupChat && (
        <GroupChatModel
          user={getSenderFull(user, selectedChat.users)}
          setToggleSenderProfile={setToggleSenderProfile}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
        />
      )}

      {/* Notification */}
      {showNotification && (
        <div className="absolute w-full h-full bg-[#161719]/80 text-white flex justify-center items-center">
          <div className="bg-[#202329] p-5 rounded-xl w-[30%] h-[50%] items-center flex flex-col">
            <div className="flex flex-row items-center mt-3 mb-6 w-full">
              <span className="flex justify-center grow text-xl">
                Notifications
              </span>
              <RxCross2
                onClick={() => setShowNotification(false)}
                className=""
              />
            </div>
            {!notification.length && (
              <p className="bg-indigo-400 px-5 py-2 rounded-lg w-[90%] flex justify-center">
                No new notification
              </p>
            )}
            {notification.map((notify) => {
              <p className="bg-indigo-400 px-5 py-2 rounded-lg w-[90%] flex justify-center">
                {notify.chat.isGroupChat
                  ? `New Message in ${notify.chat.chatName}`
                  : `New message from ${getSender(user, notify.chat.users)}`}
              </p>;
            })}
          </div>
        </div>
      )}
      {/* Create Group Modal */}
      {createGroup && (
        <CreateGroup
          user={user}
          createGroup={createGroup}
          setCreateGroup={setCreateGroup}
        />
      )}
    </main>
  );
};

export default Chatpage;
