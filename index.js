import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

const PORT = process.env.PORT;

io.listen(PORT);

console.log("Server is running at port " + PORT);

let users = [];

const addUsers = (userData, socketId) => {
  const existingUser = users.find((user) => user.sub === userData.sub);
  if (!existingUser) {
    users.push({ ...userData, socketId });
    console.log(`User added with sub: ${userData.sub}`);
  } else {
    console.log(`User with sub ${userData.sub} already exists`);
  }
};

const getUser = (userId) => {
  const user = users.find((user) => user.sub === userId);

  if (user) {
    console.log(`User found with sub: ${user.sub}`);
    // Perform actions specific to the user
  } else {
    console.log(`User not found with userId: ${userId}`);
    // Perform actions for when the user is not found
  }

  return user;
};

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("addUsers", (userData) => {
    console.log(userData);
    addUsers(userData, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", (data) => {
    const user = getUser(data.reciverId);
    if (user && user.socketId) {
      io.to(user.socketId).emit("getMessage", data);
    } else {
      // Handle the case when the user is not found or does not have a socketId
      console.log("User not found or socketId is missing");
    }
  });
});
