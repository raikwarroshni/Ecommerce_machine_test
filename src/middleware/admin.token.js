import userSchema from "../model/user.js";
import pkg from "jsonwebtoken";
const { verify: VerifyJWT } = pkg;

export const ValidateToken = async (req, res, next) => {
  const token = req.headers["authorization"]
    ? req.headers["authorization"].replace("Bearer ", "").trim()
    : "";
  if (!token) {
    return res.status(401).json({
      code: "NOT_AUTHORISED",
      message: "Unauthorized, Please provide authentication token!",
    });
  }
  try {
    const tokenData = VerifyJWT(token, process.env.JWT_SECRET);
    const currentUser = await userSchema
      .findOne({
        email: tokenData.email,
        role_id: tokenData.role_id
      })
      .populate("role_id");
    if (!currentUser) {
      return res.status(401).json({
        code: "NOT_AUTHORISED",
        message: "Unauthorized",
      });
    }
    if (currentUser.role_id.role != "Admin") {
      return res.status(401).json({
        code: "NOT_AUTHORISED",
        message: "You are not Unauthorized. Only admin can do this action.",
      });
    }
    req.currentUser = currentUser;
    next();
  } catch (error) {
    console.log(error, "error...");
    return res.status(401).json({
      code: "NOT_AUTHORISED",
      message: "Your login session has been expired, Please login again.",
    });
  }
};
