import userSchema from "../model/user.js";
import roleSchema from "../model/role.js";
import { Password } from "../common/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const signUp = async (req, res) => {
  try {
    const { email, password, name, role_id } = req.body;
    const roleData = await roleSchema.findOne({ _id: role_id });
    if (!roleData) {
      return res.status(400).json({ message: "you assign wrong role_id" });
    }
    const userData = await userSchema.findOne({ email, role_id });
    if (userData) {
      return res.status(400).json({ message: "user is already exist" });
    }
    const salt = Password.generateSalt(10);
    await userSchema.create({
      email,
      password: Password.encryptPassword(password, salt),
      name,
      role_id,
    });
    return res.status(201).json({ message: "user register successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role_id } = req.body;
    const userData = await userSchema.findOne({ email, role_id });
    if (!userData) {
      return res.status(400).json({
        message: "user not found",
      });
    }
    const dataPassword = bcrypt.compareSync(password, userData.password);
    if (!dataPassword) {
      return res.status(400).json({
        message: "password does not matched",
      });
    }
    var token = jwt.sign(
      {
        _id: userData._id,
        email: userData.email,
        password: userData.password,
        role_id: userData.role_id,
      },
      process.env.JWT_SECRET
    );
    const userDataObject = userData.toObject();
    const { password: _, ...responseData } = userDataObject;
    return res.status(200).json({
       message: "user login successfully",
      data: responseData,
      token: token,
    });
  } catch (error) {
    console.log(error, "3error");
    res.status(500).json({ message: "Internal server error", error });
  }
};

const UserRoleList = async (req, res) => {
  try {
    const roleData = await roleSchema.find().select("role");
    return res
      .status(200)
      .json({ message: "role list data successfully fetched", data: roleData });
  } catch (error) {
    console.log(error, "3error");
    res.status(500).json({ message: "Internal server error", error });
  }
};

export default {
  signUp,
  login,
  UserRoleList,
};
