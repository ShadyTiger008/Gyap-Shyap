import React, { useState } from "react";
import { IoReturnUpBack } from "react-icons/io5";
import { MdPersonSearch } from "react-icons/md";
import { useChatState } from "../Context/ChatProvider";
import axios from "axios";
import UserCard from "../User Items/UserCard";

const SideDrawer = ({ toggleSearch, setToggleSearch }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { user, setSelectedChat, chats, setChats } = useChatState();
  const handleSearch = async () => {
    if (!search) {
      alert("Please enter something!");
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
      alert("Failed to load the search results!");
      console.log("Error : ", error);
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(!loadingChat);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user?.token}`
        }
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (
        !chats.find((chat) => {
          return chat._id === data._id;
        })
      ) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      setToggleSearch(false);
    } catch (error) {
      alert("Error fetching chat");
      console.log("Error : ", error);
    }
  };
  return (
    <main>
      {toggleSearch && (
        <div className="w-[25vw] h-full z-50 absolute bg-[#161719] top-0 left-0 rounded-r-3xl p-5 space-y-6">
          <div className="bg-[#202329] flex justify-center items-center h-10 rounded-xl">
            <span className="text-xl">Search User</span>
          </div>
          {/* search input and back button area */}
          <div className="flex flex-row items-center justify-center space-x-2">
            <button
              onClick={() => setToggleSearch(false)}
              className="bg-[#202329] flex items-center justify-center w-10 h-10 rounded-xl p-2">
              <IoReturnUpBack size={25} />
            </button>
            <div className="flex items-center h-10 bg-[#202329] rounded-xl px-4 space-x-2">
              <MdPersonSearch size={25} />
              <input
                type="search"
                placeholder="Enter name or email"
                className="w-full h-5 text-sm outline-none bg-[#202329] text-white"
                value={search}
                onChange={(e) => {
                  setLoading(true);
                  setSearch(e.target.value);
                  setSearchResult([]);
                  setLoading(false);
                }}
              />
              <button
                className="text-xs bg-[#161719] px-3 py-2 rounded-lg"
                onClick={handleSearch}>
                Go
              </button>
            </div>
          </div>

          {/* user list  */}
          <div className="h-[80%] w-full bg-[#202329] rounded-xl text-base py-5 flex flex-col items-center overflow-y-scroll">
            <div className="w-[90%] h-10 bg-[#161719] flex justify-center items-center rounded-lg mb-4">
              <span className="text-center">Users</span>
            </div>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="flex flex-col justify-center items-center w-full">
                {searchResult.map((user) => {
                  return (
                    <UserCard
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default SideDrawer;
