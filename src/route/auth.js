import { Router } from "express";
import { AuthController } from "../controller/index.js";
import { SignupValidation } from "../validation/user.js";
import { validate } from "express-validation";
import validation from "../middleware/validation.js";

const AuthRouter = Router();

//sign-Up
AuthRouter.post(
  "/signUp",
  validate(SignupValidation),
  validation,
  AuthController.signUp
);

//login
AuthRouter.post("/login", AuthController.login);

//role list
AuthRouter.get("/role-list", AuthController.UserRoleList);

export default AuthRouter;
