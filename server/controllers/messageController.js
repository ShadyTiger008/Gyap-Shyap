const asyncHandler = require("express-async-handler");
const Message = require("../Models/messageModel");
const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content) {
    console.log("Invalid data passed into request");
    return res.status(400).json({ error: "Invalid data" });
  }

  try {
    // Check if the chat with the provided chatId exists
    let chat = await Chat.findById(chatId);

    // If the chat does not exist, create a new one with a default chatName
    if (!chat) {
      chat = await Chat.create({ chatName: "Default Chat Name" });
    }

    const newMessage = {
      sender: req.user._id,
      content: content,
      chat: chat._id // Use the chat's _id
    };

    const message = await Message.create(newMessage);

    // Populate data as needed
    await message.populate("sender", "name pic");
    await message.populate("chat");
    await User.populate(message, {
      path: "chat.users",
      select: "name pic email"
    });

    // Update the latest message of the chat
    await Chat.findByIdAndUpdate(chat._id, { latestMessage: message });

    res.json(message);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
