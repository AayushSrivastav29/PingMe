let token;
let path = "http://localhost:4000";
let username;
let userId;
let currentGroupId = null;
let currentReceiverId = null;
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
  socket = io(`${path}`);

  // Emit user-online event here
  socket.emit("user-online", userId);

  // Updated socket event handler
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

  socket.on("new-pers-message", (data) => {
    // Check if message is relevant to current chat
    if (
      data.senderId == currentReceiverId ||
      (data.receiverId == currentReceiverId && data.senderId == userId)
    ) {
      addMessageToUI(
        data.sender,
        data.text,
        data.fileUrl,
        data.fileName,
        data.fileType
      );
    }
  });


  socket.on("user-joined", (obj) => {
    onlineUsersArr=[];
    const arr = obj.data;
    arr.forEach((ele)=>onlineUsersArr.push(ele));
    if (currentGroupId) {
      updateOnlineList(currentGroupId);
    }
  });

  // Load messages on page load
  loadMessages();

  socket.on("user-removed", (data) => {
    onlineUsersArr = onlineUsersArr.filter((u) => u.id !== data.id);
    if (currentGroupId) {
      updateOnlineList(currentGroupId);
    }
    //leave notification
    const ul = document.querySelector("#chat-messages");
    const li = document.createElement("li");
    li.className = "left";
    li.textContent = `${data.name} left`;
    ul.appendChild(li);
  });

   socket.on("user-left", (userId) => {
      console.log("user-left",userId);
      onlineUsersArr = onlineUsersArr.filter((u) => u.id !== userId);
      console.log("onlineUsersArr",onlineUsersArr);
    if (currentGroupId) {
      console.log(currentGroupId);
      updateOnlineList(currentGroupId);
      updateOnlineUsersList();
    }
  })

  await showGroups();

  showContacts();

  // Get filename and display it in message input
  const fileInput = document.querySelector("#file-input");
  const messageInput = document.querySelector("#send-message");

  fileInput.addEventListener("change", function () {
    if (this.files.length > 0) {
      const fileName = this.files[0].name;
      messageInput.value = fileName;
    }
  });

  document.querySelector("#send-button").addEventListener("click", sendMessage);
  document
    .querySelector("#create-group-btn")
    .addEventListener("click", displayCreateGroup);

  document
    .querySelector("#dashboard")
    .addEventListener("click", handleDashboardClick);
  document
    .querySelector("#edit-group-btn")
    .addEventListener("click", openAdminModal);
  document.querySelector("#logout").addEventListener("click", logoutHandler);

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
        li.dataset.receiverId = ele.id;
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
      addMessageToUI(
        msg.User.name,
        msg.text,
        msg.fileUrl,
        msg.fileName,
        msg.fileType
      );
    });
  } catch (error) {
    console.log(error);
  }
}

function addMessageToUI(sender, text, fileUrl, fileName, fileType) {
  const ul = document.querySelector("#chat-messages");
  const li = document.createElement("li");

  if (fileUrl) {
    if (fileType.startsWith("image/")) {
      li.innerHTML = `${sender}: <img src="${fileUrl}" alt="${fileName}" target="_blank" style="max-width:200px;"/>`;
    } else {
      li.innerHTML = `${sender}: <a href="${fileUrl}" target="_blank" download="${fileName}">${fileName}</a>`;
    }
  } else {
    li.textContent = `${sender}: ${text}`;
  }

  ul.appendChild(li);
}

document.querySelector("#attach-button").addEventListener("click", function () {
  document.querySelector("#file-input").click();
});

async function sendMessage() {
  const input = document.querySelector("#send-message");
  const text = input.value.trim();
  const fileInput = document.querySelector("#file-input");
  const file = fileInput.files[0];

  if (!text && !file && !currentGroupId && !currentReceiverId) {
    console.log("checking ", currentGroupId, currentReceiverId, text, file);
    return;
  }

  const formData = new FormData();
  formData.append("text", text);
  formData.append("groupId", currentGroupId);
  formData.append("receiverId", currentReceiverId);

  if (file) {
    formData.append("file", file);
  }
  try {
    if (currentReceiverId) {
      await axios.post(`${path}/api/pers-message/send`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      await axios.post(`${path}/api/message/send`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
    }
    input.value = "";
    fileInput.value = ""; // reset file input
  } catch (error) {
    console.log(error);
  }
}

//logout feature
async function logoutHandler() {
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
