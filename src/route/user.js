import { Router } from "express";
import { UserController } from "../controller/index.js";
import { ValidateToken } from "../middleware/user.token.js";

const UserRouter = Router();

//product list
UserRouter.get("/product-list", ValidateToken, UserController.productList);

//add to card
UserRouter.post("/add-to-card", ValidateToken, UserController.addProductToCard);

//add to card list
UserRouter.get(
  "/add-to-card",
  ValidateToken,
  UserController.productAddToCardList
);

//remove product from add to card
//The _id and status fields in the order table should be set to 'pending' get _id from the add to card list api .
UserRouter.delete(
  "/add-to-card/:_id",
  ValidateToken,
  UserController.removeProdcut
);

//order create
UserRouter.post("/create-order", ValidateToken, UserController.crateOrder);

//order list
UserRouter.get("/order-list", ValidateToken, UserController.orderList);

export default UserRouter;
