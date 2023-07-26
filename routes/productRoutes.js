import express from "express";
import { isAdmin, requiredSignIn } from "../middleware/authMiddleware.js";
import {
  categoryProductController,
  createProduct,
  deleteProduct,
  filterController,
  getProduct,
  getSingleProduct,
  paymentCheckController,
  paymentTokenController,
  productCount,
  productListController,
  productPicController,
  realtedProductController,
  searchProductController,
  updateProduct,
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

router.post(
  "/createproduct",
  requiredSignIn,
  isAdmin,
  formidable(),
  createProduct
);

//getting all products

router.get("/getproduct", getProduct);

// Getting single products
router.get("/getproduct/:slug", getSingleProduct);

//Getting Photos of Products
router.get("/getproductpic/:pid", productPicController);

//Delete single Product
router.delete("/delproduct/:id", deleteProduct);

//Updating Products
router.put(
  "/updateproduct/:id",
  requiredSignIn,
  isAdmin,
  formidable(),
  updateProduct
);

// Filtering Products
router.post("/filterproduct", filterController);

//Product Count For Pagination
router.get("/productcount", productCount);

//Product List for Single Page
router.get("/productlist/:page", productListController);

//Search Product

router.get("/search/:keyword", searchProductController);

//Similar Product
router.get("/relatedproduct/:pid/:cid", realtedProductController);

//Category Wise Product

router.get("/categoryproduct/:slug", categoryProductController);

//Payment Gateway Starts Here
router.get("/payment/token", paymentTokenController);

router.post("/payment/check", requiredSignIn, paymentCheckController);

export default router;
