const express = require("express");
require("dotenv").config();
const db = require("./utils/db-connection");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

//import modules
require("./models");
const { Users } = require("./models");


//import routes
const userRoute = require("./routes/userRoute");
const messageRoute = require("./routes/messageRoute");


const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
//
const server = http.createServer(app);
const io = socketio(server); 

// Store io instance to use in controllers
app.set('socketio', io);

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Listen for a new user going online
  socket.on('user-online', async (userId) => {
    try {
      const user = await Users.findByPk(userId);
      if (user) {
        io.emit('user-joined', { name: user.name }); // Broadcast to all
      }
    } catch (error) {
      console.log('Error in user-online event:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view/signup.html"));
});

const PORT = process.env.PORT;

db.sync()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`server is running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
