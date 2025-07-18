async function createGroup(e, homeUserId) {
  e.preventDefault();
  try {
    const groupName = document.querySelector("#group-name").value;

    const members = document.querySelectorAll(".checkbox:checked");

    const membersList = [];
    members.forEach((ele) => {
      const match = ele.id.match(/\d+/);
      if (match) {
        membersList.push(Number(match[0]));
      }
    });

    //add login person id too
    membersList.push(homeUserId);
    console.log(groupName);
    console.log(membersList);

    const result = await axios.post(
      `${path}/api/group/create`,
      {
        groupName,
        membersList,
      },
      {
        headers: { Authorization: token },
      }
    );

    const p = document.createElement("p");
    p.textContent = result.data.message;
    p.style.color = "green";
    document.querySelector(".panel").appendChild(p);

    //refresh dashbaord
    showDashboard();
  } catch (error) {
    console.log(error);
  }
}
async function updateOnlineList(groupId) {
  const ul = document.querySelector("#user-online");
  ul.innerHTML = "";
  try {
    const result = await axios.get(`${path}/api/group/find-group/${groupId}`);
    console.log(result.data.members);
    const usersInGroup = result.data.members;

    onlineUsersArr
      .filter((u) => usersInGroup.includes(u.id))
      .forEach((user) => {
        const li = document.createElement("li");
        li.className = "online";
        li.textContent = `${user.name} online`;
        li.style.color = "green";
        ul.appendChild(li);
      });
  } catch (error) {
    console.log(error, "err in fetching group");
  }
}

async function handleGroupClick(event) {
  if (event.target.tagName === "LI" && event.target.dataset.groupId) {
    const groupId = event.target.dataset.groupId;
    const groupName = event.target.textContent;
    console.log(groupId, groupName);
    // Show message screen
    document.querySelector("#message-screen").hidden = false;

    // Set current group context
    currentGroupId = groupId;

    // Update UI to show group name
    document.querySelector("#group-name-header").textContent = groupName;

    updateOnlineList(groupId);

    // Check if current user is admin
    try {
      const groupResponse = await axios.get(
        `${path}/api/group/find-group/${groupId}`
      );
      const isAdmin = groupResponse.data.admin.includes(parseInt(userId));

      // Show edit button if admin
      document.querySelector("#edit-group-btn").style.display = isAdmin
        ? "block"
        : "none";
    } catch (error) {
      console.error("Error checking admin status:", error);
    }

    // Load group messages
    loadGroupMessages(groupId);
  }
}

async function loadGroupMessages(groupId) {
  try {
    const res = await axios.get(`${path}/api/message/group/${groupId}`, {
      headers: { Authorization: token },
    });

    // Clear chat messages
    const ul = document.querySelector("#chat-messages");
    ul.innerHTML = "";

    // Add messages to UI
    res.data.forEach((msg) => {
      addMessageToUI(msg.User.name, msg.text);
    });
  } catch (error) {
    console.log(error);
  }
}

// Open admin management modal
async function openAdminModal() {
  const modal = document.querySelector("#admin-modal");
  modal.style.display = "flex";

  try {
    // Load group members
    const groupResponse = await axios.get(
      `${path}/api/group/find-group/${currentGroupId}`
    );
    const memberIds = groupResponse.data.members;

    // Get all users
    const usersResponse = await axios.get(`${path}/api/user/`);

    // Populate member list
    const memberList = document.querySelector("#member-list");
    memberList.innerHTML = "";

    memberIds.forEach((memberId) => {
      const user = usersResponse.data.find((u) => u.id === memberId);
      if (user) {
        const li = document.createElement("li");
        li.innerHTML = `
          ${user.name} 
          ${
            groupResponse.data.admin.includes(memberId)
              ? '<span class="admin-badge">Admin</span>'
              : ""
          }
          <button class="remove-member-btn" data-id="${memberId}">Remove</button>
          ${
            groupResponse.data.admin.includes(memberId)
              ? `<button class="remove-admin-btn" data-id="${memberId}">Remove Admin</button>`
              : `<button class="make-admin-btn" data-id="${memberId}">Make Admin</button>`
          }
        `;
        memberList.appendChild(li);
      }
      //close it
      document
        .querySelectorAll(".close-btn")[1]
        .addEventListener("click", () => {
          modal.style.display = "none";
        });
    });

    // Populate add member dropdown
    const addMemberSelect = document.querySelector("#add-member-select");
    addMemberSelect.innerHTML = '<option value="">Select a user</option>';

    usersResponse.data.forEach((user) => {
      if (!memberIds.includes(user.id)) {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        addMemberSelect.appendChild(option);
      }
    });

    // Add event listeners
    document.querySelectorAll(".remove-member-btn").forEach((btn) => {
      btn.addEventListener("click", removeMember);
    });

    document.querySelectorAll(".make-admin-btn").forEach((btn) => {
      btn.addEventListener("click", makeAdmin);
    });

    document.querySelectorAll(".remove-admin-btn").forEach((btn) => {
      btn.addEventListener("click", removeAdmin);
    });

    document
      .querySelector("#add-member-btn")
      .addEventListener("click", addMember);
  } catch (error) {
    console.error("Error loading admin modal:", error);
  }
}

// Admin actions
async function removeMember(event) {
  let userId = event.target.dataset.id;
    userId = parseInt(userId);

  try {
    await axios.post(
      `${path}/api/group/remove-member`,
      {
        groupId: currentGroupId,
        userId,
      },
      {
        headers: { Authorization: token },
      }
    );

    openAdminModal(); // Refresh modal
  } catch (error) {
    console.error("Error removing member:", error);
  }
}

async function makeAdmin(event) {
  let userId = event.target.dataset.id;
    userId = parseInt(userId);
  try {
    await axios.post(
      `${path}/api/group/make-admin`,
      {
        groupId: currentGroupId,
        userId,
      },
      {
        headers: { Authorization: token },
      }
    );

    openAdminModal(); // Refresh modal
  } catch (error) {
    console.error("Error making admin:", error);
  }
}

async function removeAdmin(event) {
  let userId = event.target.dataset.id;
    userId = parseInt(userId);

  try {
    await axios.post(
      `${path}/api/group/remove-admin`,
      {
        groupId: currentGroupId,
        userId,
      },
      {
        headers: { Authorization: token },
      }
    );

    openAdminModal(); // Refresh modal
  } catch (error) {
    console.error("Error removing admin:", error);
  }
}

async function addMember() {
  const select = document.querySelector("#add-member-select");
  let userId = select.value;
    userId= parseInt(userId);
  if (!userId) return;

  try {
    await axios.post(
      `${path}/api/group/add-member`,
      {
        groupId: currentGroupId,
        userId,
      },
      {
        headers: { Authorization: token },
      }
    );

    openAdminModal(); // Refresh modal
  } catch (error) {
    console.error("Error adding member:", error);
  }
}
