let token;
let path = "http://localhost:3000";
let username;
document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
  token = localStorage.getItem("token");
  username = localStorage.getItem("name");
  const userId = localStorage.getItem("userId");

  // Setup WebSocket (Socket.io)
  const socket = io("http://localhost:3000");

  // Emit user-online event here
  socket.emit("user-online", userId);

  // Listen for new messages
  socket.on("new-message", (data) => {
    addMessageToUI(data.sender, data.text);
  });

  // Listen for new users joining
  socket.on("user-joined", (data) => {
    console.log(data);
    const ul = document.querySelector("#chat-messages");
    const li = document.createElement("li");
    li.className = "joined"; // Apply CSS class for notifications
    li.textContent = `${data.name} joined`;
    ul.appendChild(li);
  });

  //get online users
  onlineUsersHandler();

  // Load messages on page load
  loadMessages();

  socket.on("user-left", (data) => {
    const ul = document.querySelector("#chat-messages");
    const li = document.createElement("li");
    li.className = "left";
    li.textContent = `${data.name} left`;
    ul.appendChild(li);
  });

  // Send message on button click
  document.querySelector("#send-button").addEventListener("click", sendMessage);
}

async function loadMessages() {
  try {
    const res = await axios.get(`${path}/api/message/get`, {
      headers: { Authorization: token },
    });
    console.log(res);
    res.data.forEach((msg) => {
      addMessageToUI(msg.User.name, msg.text);
    });
  } catch (error) {
    console.log(error);
  }
}

function addMessageToUI(sender, text) {
  const ul = document.querySelector("ul");
  const li = document.createElement("li");
  li.textContent = `${sender}: ${text}`;
  ul.appendChild(li);
}

async function sendMessage() {
  const input = document.querySelector("#send-message");
  const text = input.value.trim();

  if (!text) return;

  try {
    await axios.post(
      `${path}/api/message/send`,
      { text },
      {
        headers: { Authorization: token },
      }
    );
    input.value = ""; // Clear input
  } catch (error) {
    console.log(error);
  }
}

//logout feature
document.querySelector("#logout").addEventListener("click", async () => {
  try {
    const res = await axios.get(`${path}/api/user/logout`, {
      headers: { Authorization: token },
    });
    console.log(res.data.message);
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("userId"); // Add this
    window.location.href = "/view/login.html";
  } catch (error) {
    console.log(error);
  }
});

// async function onlineUsersHandler() {
//   try {
//     const onlineUsers = await axios.get(`${path}/api/user/online`);
//     console.log(onlineUsers.data);
//     const onlineUsersList = onlineUsers.data;
//     const ul = document.querySelector("ul");
//     //listing online users
//     for (let i = 0; i < onlineUsersList.length; i++) {
//       let ele = onlineUsersList[i];
//       if (ele.name != username) {
//         const li = document.createElement("li");
//         li.textContent = `${ele.name} joined`;
//         if (i % 2 == 0) {
//           li.style.backgroundColor = "lightgrey";
//         }
//         ul.appendChild(li);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

async function onlineUsersHandler() {
  try {
    const ul = document.querySelector("#chat-messages");
    const onlineUsers = await axios.get(`${path}/api/user/online`);
    const onlineUsersList = onlineUsers.data;
    
    // Add current user
    const youLi = document.createElement("li");
    youLi.className = "joined";
    youLi.textContent = "You joined";
    ul.appendChild(youLi);
    
    // Add other users
    onlineUsersList.forEach(user => {
      if (user.name !== username) {
        const li = document.createElement("li");
        li.className = "joined";
        li.textContent = `${user.name} joined`;
        ul.appendChild(li);
      }
    });
  } catch (error) {
    console.log(error);
  }
}