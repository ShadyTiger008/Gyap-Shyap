import React, { useState } from "react";
import { useChatState } from "../Context/ChatProvider";
import { RxCross2 } from "react-icons/rx";
import UserBadgeItem from "../User Items/UserBadgeItem";
import axios from "axios";
import UserListItem from "../User Items/UserListItem";

const GroupChatModel = ({
  fetchAgain,
  setFetchAgain,
  setToggleSenderProfile
}) => {
  const { selectedChat, setSelectedChat, user } = useChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [Search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const handleRemove = async (userToRemove) => {
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      // Check if selectedChat is defined and has the expected properties
      if (selectedChat && selectedChat._id && userToRemove._id) {
        const { data } = await axios.put(
          "/api/chat/groupremove",
          {
            chatId: selectedChat._id,
            userId: userToRemove._id
          },
          config
        );

        // Deselect the chat
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
      } else {
        alert("Failed to remove the user.");
      }

      setLoading(false);
    } catch (error) {
      alert("Failed to remove the user");
      console.log("Error:", error);
    }
  };



  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      alert("Error Occurred!");
      console.log("Error: ", error);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert("Failed to load the search result");
      console.log("Error: ", error);
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((user) => user._id === userToAdd._id)) {
      alert("This user is already in this chat.");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      alert("Failed to add the user");
      console.log("Error:", error);
    }
  };

  return (
    <main className="w-screen h-screen bg-[#161719]/80 absolute flex  justify-center items-center text-white overflow-y-scroll">
      <div className="w-[25%] h-fit p-5 rounded-xl flex flex-col justify-center items-center bg-[#202329] space-y-10">
        <div className="w-full flex flex-row">
          <span className="grow text-center text-2xl font-semibold">
            {selectedChat.chatName}
          </span>
          <button onClick={() => setToggleSenderProfile(false)}>
            <RxCross2 />
          </button>
        </div>
        {/* Display group-related information here */}
        <div className="flex flex-col space-y-2">
          <div className="flex flex-row space-x-2">
            <input
              type="text"
              placeholder="Enter group name..."
              className="w-full py-2 px-5 rounded-md outline-none text-gray-700 "
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <button
              className="float-right rounded-md px-5 py-2 bg-emerald-400 text-sm font-semibold hover:bg-emerald-500"
              onClick={handleRename}>
              Update
            </button>
          </div>
          <div className="flex flex-row space-x-2">
            <input
              type="text"
              placeholder="Add User e.g: John, Jane"
              className="w-full py-2 px-5 rounded-md outline-none text-gray-700 "
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button className="float-right rounded-md px-5 py-2 font-semibold bg-emerald-400 hover:bg-emerald-500">
              Add
            </button>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
              />
            ))
          )}
          {selectedChat.users.map((user) => (
            <UserBadgeItem
              user={user}
              key={user._id}
              handleFunction={() => handleRemove(user)}
            />
          ))}
        </div>
        <div className="w-full">
          <button
            onClick={() => handleRemove(user)}
            className="float-right rounded-lg px-5 py-2 bg-red-500 hover:bg-red-700">
            Leave Group
          </button>
        </div>
      </div>
    </main>
  );
};

export default GroupChatModel;
