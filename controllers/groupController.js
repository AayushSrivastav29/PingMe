const  Group  = require("../models/groupModel");

const addGroup = async (req, res) => {
  try {
    const {groupName, membersList } = req.body;
    const userId = parseInt(req.user.id); // Ensure it's a number
   
    console.log(userId, membersList ,"<<<<<<<<<<<<<<<<<<");

    const group = await Group.create({
      groupName,
      members: membersList,
      admin: [userId]
    })
    
    res.status(201).json({data: group, message:`${groupName} created successfully`, success: true })
  } catch (error) {
    console.log(error);
    res.status(500).json({message:`error in creating group`, success: false})
  }
}

const findGroupWhereUserExists = async (req, res) => {
  const { id } = req.params;
    const userId = parseInt(id);
  try {
    const allGroups = await Group.findAll();

    // Filter groups where userId is in the members array
    const userGroups = allGroups.filter(group => {
      const members = group.members; // already parsed due to getter
      return Array.isArray(members) && members.includes(userId);
    });

    const groupNames = userGroups.map(group => group.groupName);

    res.status(200).json({ groups: userGroups });
  } catch (error) {
    console.error("Error finding groups:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const findGroup = async (req,res) => {
    const {groupId} = req.params;
    try {
        const group = await Group.findByPk(groupId);
        res.status(200).send(group);
    } catch (error) {
        console.log(error);
        res.status(404).send(`No group with ${groupId} found`);
    }

}

// edit group functions-

// Add member to group (admin only)
const addMember = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await Group.findByPk(groupId);
    
    // Check if requester is admin
    if (!group.admin.includes(req.user.id)) {
      return res.status(403).json({ error: 'Only admins can add members' });
    }
    
    // Add new member
    const updatedMembers = [...group.members, userId];
    await group.update({ members: updatedMembers });
    
    res.status(200).json({ message: 'Member added successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error adding member' });
  }
}

// Remove member from group (admin only)
const removeMember = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await Group.findByPk(groupId);
    
    // Check if requester is admin
    if (!group.admin.includes(req.user.id)) {
      return res.status(403).json({ error: 'Only admins can remove members' });
    }

    if (group.admin.length === 1) {
      return res.status(400).json({ error: 'Cannot remove the only admin' });
    }
    
    // Remove member
    const updatedMembers = group.members.filter(id => id !== userId);
    
    // Remove from admins if they were admin
    let updatedAdmins = group.admin;
    if (updatedAdmins.includes(userId)) {
      updatedAdmins = updatedAdmins.filter(id => id !== userId);
    }
    
    await group.update({ 
      members: updatedMembers,
      admin: updatedAdmins
    });
    
    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error removing member' });
  }
}

// Make member admin (admin only)
const makeAdmin = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await Group.findByPk(groupId);
    
    // Check if requester is admin
    if (!group.admin.includes(req.user.id)) {
      return res.status(403).json({ error: 'Only admins can make others admin' });
    }
    
    // Add to admins
    const updatedAdmins = [...group.admin, userId];
    await group.update({ admin: updatedAdmins });
    
    res.status(200).json({ message: 'Member made admin successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error making admin' });
  }
}

// Remove admin status (admin only)
const removeAdmin = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await Group.findByPk(groupId);
    // Check if requester is admin
    if (!group.admin.includes(req.user.id)) {
      return res.status(403).json({ error: 'Only admins can remove admin status' });
    }
    
    // Prevent removing last admin
    if (group.admin.length === 1) {
      return res.status(400).json({ error: 'Cannot remove the only admin' });
    }
    
    // Remove from admins
    const updatedAdmins = group.admin.filter(id => id !== userId);
    await group.update({ admin: updatedAdmins });
    
    res.status(200).json({ message: 'Admin status removed successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error removing admin status' });
  }
}

module.exports={
    addGroup,
    findGroupWhereUserExists,
    findGroup,
    addMember,
    removeMember,
    makeAdmin,
    removeAdmin

}