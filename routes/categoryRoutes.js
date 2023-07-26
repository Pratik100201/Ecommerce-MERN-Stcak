import express from "express";
import { isAdmin, requiredSignIn } from "../middleware/authMiddleware.js";
import {
  categoryController,
  updateCategory,
  allCategory,
  singleCategory,
  deleteOne,
} from "../controllers/categoryController.js";

const router = express.Router();

//Create Category Route
router.post("/createcategory", requiredSignIn, isAdmin, categoryController);

//Update Category Route
router.put("/updatecategory/:id", requiredSignIn, isAdmin, updateCategory);

//Getting All Categories
router.get("/getall", allCategory);

//Only One Category
router.get("/single/:slug", singleCategory);

//Delete One Category
router.delete("/deletecategory/:id", requiredSignIn, isAdmin, deleteOne);

export default router;
