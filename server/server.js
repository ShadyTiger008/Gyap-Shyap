// Server-side (server.js)
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
connectDB();

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000"
  }
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("typing", (room) => socket.to(room).emit("typing"));
  socket.on("stop typing", (room) => socket.to(room).emit("stop typing"));

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
    io.to(room).emit("user joined room", room);
  });

  // Handle incoming messages from clients and broadcast them to the chat room
  // In your server.js
  socket.on("sendMessage", (message) => {
    if (!message || !message.chat || !message.chat.users) {
      console.log("Invalid message format or chat/users not defined");
      return;
    }

    const chat = message.chat;
    io.to(chat._id).emit("message received", message);
    console.log("Message received and emitted to the chat room:", message);
  });
});
