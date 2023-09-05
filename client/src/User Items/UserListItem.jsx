import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div className="flex flex-col cursor-pointer bg-purple-500 px-3 py-1 rounded-md text-sm " onClick={handleFunction}>
      <span>{user.name}</span>
      <span>{user.email}</span>
    </div>
  );
};

export default UserListItem;
