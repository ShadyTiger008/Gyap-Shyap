import React from "react";
import { RxCross2 } from "react-icons/rx";

const SenderProfile = ({ user, setToggleSenderProfile }) => {
  return (
    <main className="w-screen h-screen bg-[#161719]/80 absolute flex  justify-center items-center text-white">
      <div className="w-[25%] h-fit p-5 rounded-xl flex flex-col justify-center items-center bg-[#202329] space-y-10">
        <div className="w-full flex flex-row ">
          <span className="grow text-center text-3xl font-semibold">
            {user.name}
          </span>
          <button onClick={() => setToggleSenderProfile(false)}>
            <RxCross2 />
          </button>
        </div>
        <img
          src={user.pic}
          alt="User Profile Pic"
          className="w-20 h-20 rounded-full"
        />
        <div className="flex flex-row space-x-4 text-xl">
          <span className="font-bold">Email:</span> <span>{user.email}</span>
        </div>
        <div className="w-full">
          <button
            onClick={() => setToggleSenderProfile(false)}
            className="float-right rounded-xl px-5 py-2 bg-[#161719]">
            Close
          </button>
        </div>
      </div>
    </main>
  );
};

export default SenderProfile;
