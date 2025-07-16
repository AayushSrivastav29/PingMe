const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

const generateAccessToken = (id) => {
  return jwt.sign({ UserId: id }, secretKey);
};


const addUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    //check if user exists
    const checkUser = await Users.findOne({
      where: {
        email: email,
      },
    });
    if (checkUser) {
      return res
        .status(500)
        .json({ message: "User already exists, Please Login", success: false });
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
    });
    res
      .status(201)
      .json({ message: `user signed up successfully`, success: true });
  } catch (error) {
    console.log("Error in creating user", error.message);
    res.status(500).json({ message: "Error in creating user", success: false });
  }
};

const findUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({
      where: {
        email: email,
      },
    });

    //compare password
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({message:"Error comparing passwords", success: false});
      } else if (!result) {
        return res.status(401).json({message:"Password incorrect", success: false});
      } else {
        return res.status(200).json({
          success: true,
          message: "User logged in",
            token: generateAccessToken(user.id),
          user: user,
        });
      }
    });

  } catch (error) {
    res.status(404).json({ message: "User not found", success: false });
  }
};

module.exports = {
  addUser,
  findUser
};
