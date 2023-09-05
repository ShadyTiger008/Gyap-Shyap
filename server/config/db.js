const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://root:jXteiJ7HfZDgbzDX@cluster0.4amkyzs.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error: ", error);
    process.exit();
  }
};

module.exports = connectDB;
