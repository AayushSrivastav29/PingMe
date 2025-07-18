const  Group  = require("../models/groupModel");

const addGroup = async (req,res) => {
    try {
        const {groupName, membersList } = req.body;
        
        const group= await Group.create({
            groupName,
            members: membersList
        })
        res.status(201).json({data: group , message:`${groupName} created successfully`, success: true })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:`error in creating group`, success: false})
    }
}

const findGroup = async (req, res) => {
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



module.exports={
    addGroup,
    findGroup
}