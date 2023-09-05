import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useChatState } from "../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../User Items/UserListItem";
import UserBadgeItem from "../User Items/UserBadgeItem";

const CreateGroup = ({ createGroup, setCreateGroup }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats } = useChatState();
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
      const { data } = await axios.get(`api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert("Failed to load the search result");
      console.log("Error: ", error);
    }
  };
  const handleSubmit = async () => {
    if (!groupName || !selectedUsers) {
      alert("Please fill all the fields");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupName,
          users: JSON.stringify(
            selectedUsers.map((user) => {
              return user._id;
            })
          )
        },
        config
      );
      setChats([data, ...chats]);
      alert("New Group chat created!");
    } catch (error) {
      // Handle the error, e.g., display an error message
      console.error("Error:", error);
      alert("Failed to create a new group chat.");
    }
    setCreateGroup(false);
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      alert("User is already added!");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== delUser._id));
  };

  return (
    <main className="w-screen h-screen bg-[#161719]/80 absolute flex  justify-center items-center text-white">
      <div className="w-[25%] h-fit p-5 rounded-xl flex flex-col justify-center items-center bg-[#202329] space-y-10">
        <div className="w-full flex flex-row ">
          <span className="grow text-center text-2xl font-medium">
            Create Group Chat
          </span>
          <button onClick={() => setCreateGroup(false)}>
            <RxCross2 />
          </button>
        </div>
        <div className="w-[90%] justify-center items-center space-y-4">
          <input
            type="text"
            placeholder="Enter group name..."
            className="w-full py-2 px-5 rounded-md outline-none text-gray-700"
            onChange={(e) => setGroupName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Add User eg: John, Jane"
            className="w-full py-2 px-5 rounded-md outline-none text-gray-700"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="flex flex-row flex-wrap">
            {selectedUsers.map((user) => {
              return (
                <UserBadgeItem
                  user={user}
                  key={user._id}
                  handleFunction={() => handleDelete(user)}
                />
              );
            })}
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex flex-row flex-wrap w-[80%] space-x-2">
              {searchResult?.slice(0, 4).map((user) => {
                return (
                  <UserListItem
                    user={user}
                    key={user._id}
                    handleFunction={() => handleGroup(user)}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="w-full">
          <button
            className="float-right rounded-xl px-5 py-2 bg-[#161719]"
            onClick={handleSubmit}>
            Create Chat
          </button>
        </div>
      </div>
    </main>
  );
};

export default CreateGroup;
