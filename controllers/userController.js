const Users = require("../models/userModel");
const bcrypt = require("bcrypt");

const addUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    //check if user exists
    const checkUser= await Users.findOne({
      where: {
        email: email,
      },
    });
    if(checkUser){
       return res.status(500).json({ message: "user with email already exists", success: false });
    }
    //hash password
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return console.log("Error in hashing password", err);
      }
      await Users.create({
        name,
        email,
        phone,
        password: hash,
      });
      res.status(201).json({message:`user signed up successfully`, success:true});
    });
  } catch (error) {
    console.log("Error in creating user", error.message);
    res.status(500).json({ message: "Error in creating user", success: false });
  }
};

module.exports = {
  addUser,
};
