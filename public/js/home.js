let token;
let path = "http://localhost:3000";
let username;
document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
  token = localStorage.getItem("token");
  //add name
  username = localStorage.getItem("name");
  document.querySelector("#user-name").textContent = username;

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

  //show contacts
  showContacts();

  // Send message on button click
  document.querySelector("#send-button").addEventListener("click", sendMessage);
  document
    .querySelector("#create-group-btn")
    .addEventListener("click", createGroup);
}

async function showContacts() {
  const ul = document.querySelector("#dashboard");
  try {
    const result = await axios.get(`${path}/api/user/`);
    console.log(result.data);
    const contactsList = result.data;
    contactsList.forEach((ele) => {
      if (ele.name != username) {
        const li = document.createElement("li");
        li.textContent = `${ele.name}`;
        ul.appendChild(li);
      }
    });
  } catch (error) {
    console.log(error);
    const li = document.createElement("li");
    li.textContent = `Error in fetching all contacts`;
    ul.appendChild(li);
  }
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
  const ul = document.querySelector("#chat-messages");
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
    onlineUsersList.forEach((user) => {
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

async function createGroup() {
  const createGroupDiv = document.querySelector("#create-group");
  //open
  createGroupDiv.style.display = "flex";
  //show contacts to add
  const result = await axios.get(`${path}/api/user/`);
  const contactsList = result.data;
  const chooseContacts = document.querySelector("#choose-contacts");

  contactsList.forEach((ele) => {
    if (ele.name != username) {
      const wrapper = document.createElement("div");
      wrapper.classList.add("contact-wrapper");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = ele.name;
      checkbox.id = `user-${ele.id}`;

      const label = document.createElement("label");
      label.setAttribute("for", `user-${ele.id}`);
      label.textContent = ele.name;

      wrapper.appendChild(checkbox);
      wrapper.appendChild(label);
      chooseContacts.appendChild(wrapper);
    }
  });
  //close
  document.querySelector(".close-btn").addEventListener("click", () => {
    createGroupDiv.style.display = "none";
    // Remove old contact wrappers only
    const oldWrappers = chooseContacts.querySelectorAll(".contact-wrapper");
    oldWrappers.forEach((wrapper) => wrapper.remove());
  });
}
