const app = require("./src/app");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const connectDB = require("./src/config/db");

connectDB();

const PORT = process.env.PORT || 5000;

// ✅ create http server
const server = http.createServer(app);

// ✅ setup socket
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// ✅ make io global (so controllers can use it)
global.io = io;

// ✅ socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join user room
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log("User joined room:", userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ✅ start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
