const express = require("express");
require("dotenv").config();
const db = require("./utils/db-connection");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const {CronJob} = require('cron');

//import modules
require("./models");
const { Users } = require("./models");
const messageController = require('./controllers/messageController');

//import routes
const userRoute = require("./routes/userRoute");
const messageRoute = require("./routes/messageRoute");
const groupRoute = require("./routes/groupRoute");


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
      const onlineUsers = await Users.findAll({
        where:{
          isOnline:true
        }
      });
      if (onlineUsers) {
        io.emit('user-joined', { data: onlineUsers }); // Broadcast to all
      }
    } catch (error) {
      console.log('Error in user-online event:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Run every day at 2:00 AM
const job = new CronJob('0 2 * * *', () => {
  messageController.archiveOldMessages()
    .then(() => console.log('[CRON] Archiving completed'))
    .catch(err => console.error('[CRON] Archiving failed:', err));
});
job.start();

app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);
app.use("/api/group", groupRoute);


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
