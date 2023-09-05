import React from "react";
import { RxCross2 } from "react-icons/rx";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <div className="flex flex-row flex-wrap items-center space-x-2 cursor-pointer bg-indigo-500 hover:bg-indigo-700 px-3 py-1 rounded-lg w-fit" onClick={handleFunction}>
      <span>{user.name}</span>
      <RxCross2 />
    </div>
  );
};

export default UserBadgeItem;
