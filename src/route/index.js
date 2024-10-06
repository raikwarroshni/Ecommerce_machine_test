import { Router } from "express";
import UserRouter from "./user.js";
import AdminRouter from "./admin.js";
import AuthRouter from "./auth.js";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);
router.use("/admin", AdminRouter);

export default router;
