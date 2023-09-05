export const getSender = (loggedsUser, users) => {
  if (!loggedsUser || !users || users.length < 2) {
    return "Unknown Sender";
  }

  return users[0]._id === loggedsUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedsUser, users) => {
  if (!loggedsUser || !users || users.length < 2) {
    return null; // Return null or handle the error as needed
  }

  return users[0]._id === loggedsUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, message, index, userId) => {
  const result =
    index < messages.length - 1 &&
    (messages[index + 1].sender._id !== message.sender._id ||
      messages[index + 1].sender._id === undefined) &&
    messages[index].sender._id !== userId;
  console.log("isSameSender result:", result);
  return result;
};

export const isLastMessage = (messages, index, userId) => {
  const result =
    index === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id;
  console.log("isLastMessage result:", result);
  return result;
};

export const isSameSenderMargin = (messages, message, index, userId) => {
  if (
    index < messages.length - 1 &&
    messages[index + 1].sender._id === message.sender._id &&
    messages[index].sender._id !== userId
  )
    return 33;
  else if (
    (index < messages.length - 1 &&
      messages[index + 1].sender._id !== message.sender._id &&
      messages[index].sender._id !== userId) ||
    (index === messages.length - 1 && messages[index].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameUser = (messages, message, index) => {
  return index > 0 && messages[index - 1].sender._id === message.sender._id;
};
