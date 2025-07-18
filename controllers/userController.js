const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

const generateAccessToken = (id) => {
  return jwt.sign({ UserId: id }, secretKey);
};

const getAllUsers = async (req,res) => {
   try {
    const users = await Users.findAll();
    res.status(200).send(users);
   } catch (error) {
    console.log(error.message);
    res.status(404).send("error in getting all users");
   }
}

const logoutUser = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await Users.findByPk(id);
    await user.update({ isOnline: false });
    // Broadcast user-left event
    if (req.app.get("socketio")) {
      req.app.get("socketio").emit("user-left", { name: user.name });
    }

    res.status(200).json({ message: "user logged out", success: true });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Error in logging out", success: false });
  }
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
      const user = await Users.create({
        name,
        email,
        phone,
        password: hash,
        isOnline: false,
      });

      res.status(201).json({
        message: `user signed up successfully`,
        name: name,
        success: true,
      });
    });
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
    bcrypt.compare(password, user.password, async (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error comparing passwords", success: false });
      } else if (!result) {
        return res
          .status(401)
          .json({ message: "Password incorrect", success: false });
      } else {
        //update online status
        await user.update({ isOnline: true });
        if (req.app.get("socketio")) {
          req.app.get("socketio").emit("user-online", user.id);
        }

        return res.status(200).json({
          success: true,
          message: "User logged in",
          token: generateAccessToken(user.id),
          name: user.name,
          userId: user.id, // for socket io
        });
      }
    });
  } catch (error) {
    res.status(404).json({ message: "User not found", success: false });
  }
};

const checkOnlineUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      where: {
        isOnline: true,
      },
    });
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ message: "Error in getting online users", success: false });
  }
};

module.exports = {
  getAllUsers,
  addUser,
  findUser,
  checkOnlineUsers,
  logoutUser,
};
