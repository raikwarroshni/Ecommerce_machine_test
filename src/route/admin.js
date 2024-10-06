import { Router } from "express";
import { AdminController } from "../controller/index.js";
import { ValidateToken } from "../middleware/admin.token.js";
import { file } from "../common/index.js";
import { productValidation } from "../validation/product.js";
import { validate } from "express-validation";
import validation from "../middleware/validation.js";

const AdminRouter = Router();

//view category list
AdminRouter.get("/category-list", AdminController.categoryList);

//create product
AdminRouter.post(
  "/create-product",
  ValidateToken,
  file.imageUpload.single("image"),
  validate(productValidation),
  validation,
  AdminController.createproduct
);

//update product
AdminRouter.put(
  "/update-product",
  ValidateToken,
  file.imageUpload.single("image"),
  AdminController.updateproduct
);

//delete product
AdminRouter.delete(
  "/delete-product/:productId",
  ValidateToken,
  AdminController.deleteProduct
);

//view details
AdminRouter.get(
  "/product-details/:productId",
  ValidateToken,
  AdminController.productDetails
);

//update order status
AdminRouter.put("/order-status", ValidateToken, AdminController.productStatus);

export default AdminRouter;
