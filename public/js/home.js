let token;
let path = "http://13.203.161.226:4000";
let username;
let userId;
let currentGroupId = null;
let socket;
let onlineUsersArr = [];
document.addEventListener("DOMContentLoaded", initialize);

async function initialize() {
  token = localStorage.getItem("token");
  //add name
  username = localStorage.getItem("name");
  document.querySelector("#user-name").textContent = username;

  userId = localStorage.getItem("userId");

  // Setup WebSocket (Socket.io)
  socket = io("http://13.203.161.226:4000");

  // Emit user-online event here
  socket.emit("user-online", userId);

  // Listen for new messages
  socket.on("new-message", (data) => {
    if (data.groupId === currentGroupId) {
      addMessageToUI(data.sender, data.text);
    }
  });

  socket.on("user-joined", (obj) => {
    console.log("user-joined event received:", obj);
    const arr= obj.data;
    onlineUsersArr=arr;
    console.log(onlineUsersArr);
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

  //show groups
  await showGroups();

  //show contacts
  showContacts();

  // Send message on button click
  document.querySelector("#send-button").addEventListener("click", sendMessage);
  document
    .querySelector("#create-group-btn")
    .addEventListener("click", displayCreateGroup);

  document
    .querySelector("#dashboard")
    .addEventListener("click", handleGroupClick);
  document.querySelector("#edit-group-btn").addEventListener("click", openAdminModal);
}

function showDashboard() {
  const ul = document.querySelector("#dashboard");
  ul.innerHTML = "";
  showGroups();
  showContacts();
}
async function showGroups() {
  const ul = document.querySelector("#dashboard");
  ul.innerHTML = "";
  try {
    const result = await axios.get(`${path}/api/group/find/${userId}`);
    const groupsList = result.data.groups;
    console.log(result);
    groupsList.forEach((group) => {
      const li = document.createElement("li");
      li.textContent = group.groupName;
      li.dataset.groupId = group.id;
      ul.appendChild(li);
    });
  } catch (error) {
    console.log(error);
  }
}

async function showContacts() {
  const ul = document.querySelector("#dashboard");
  try {
    //show contacts
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

function addMessageToUI(sender, text, fileUrl, fileName, fileType) {
  const ul = document.querySelector("#chat-messages");
  const li = document.createElement("li");
  
  if (fileUrl) {
    if (fileType.startsWith('image/')) {
      li.innerHTML = `${sender}: <img src="${fileUrl}" alt="${fileName}" style="max-width:200px;"/>`;
    } else {
      li.innerHTML = `${sender}: <a href="${fileUrl}" download="${fileName}">${fileName}</a>`;
    }
  } else {
    li.textContent = `${sender}: ${text}`;
  }
  
  ul.appendChild(li);
}

// Update socket event handler
socket.on("new-message", (data) => {
  if (data.groupId === currentGroupId) {
    addMessageToUI(
      data.sender, 
      data.text, 
      data.fileUrl, 
      data.fileName,
      data.fileType
    );
  }
});

document.querySelector("#attach-button").addEventListener("click", function() {
  document.querySelector("#file-input").click();
});

async function sendMessage() {
  const input = document.querySelector("#send-message");
  const text = input.value.trim();
  const fileInput = document.querySelector("#file-input");
  const file = fileInput.files[0];

  if ((!text && !file) || !currentGroupId) return;

  const formData = new FormData();
  formData.append('text', text);
  formData.append('groupId', currentGroupId);
  if (file) {
    formData.append('file', file);
  }

  try {
    await axios.post(
      `${path}/api/message/send`,
      formData,
      {
        headers: { 
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        },
      }
    );
    input.value = "";
    fileInput.value = ""; // reset file input
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

async function displayCreateGroup() {
  const createGroupDiv = document.querySelector("#create-group");
  //open
  createGroupDiv.style.display = "flex";
  //show contacts to add
  const result = await axios.get(`${path}/api/user/`);
  const contactsList = result.data;
  const chooseContacts = document.querySelector("#choose-contacts");
  let homeUserId;
  contactsList.forEach((ele) => {
    if (ele.name === username) {
      homeUserId = ele.id;
    }
    if (ele.name != username) {
      const wrapper = document.createElement("div");
      wrapper.classList.add("contact-wrapper");
      const checkbox = document.createElement("input");
      checkbox.classList.add("checkbox");
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

  document.querySelector("#save-group").addEventListener("click", function (e) {
    createGroup(e, homeUserId);
  });
}