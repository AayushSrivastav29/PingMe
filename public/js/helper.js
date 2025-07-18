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

    const result = await axios.post(`${path}/api/group/create`, {
      groupName,
      membersList,
    });

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

function handleGroupClick(event) {
  if (event.target.tagName === 'LI' && event.target.dataset.groupId) {
    const groupId = event.target.dataset.groupId;
    const groupName = event.target.textContent;
    console.log(groupId, groupName);
    // Show message screen
    document.querySelector("#message-screen").hidden = false;
    
    // Set current group context
    currentGroupId = groupId;
    
    // Update UI to show group name
    document.querySelector("#group-name-header").textContent = groupName;
    
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
    ul.innerHTML = '';
    
    // Add messages to UI
    res.data.forEach((msg) => {
      addMessageToUI(msg.User.name, msg.text);
    });
  } catch (error) {
    console.log(error);
  }
}