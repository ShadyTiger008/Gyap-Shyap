const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    content: {
      type: String,
      required: [true, "Message is required"],
      trim: true
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat"
    }
  },
  {
    timestamps: true // This option should be inside the schema options object
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
