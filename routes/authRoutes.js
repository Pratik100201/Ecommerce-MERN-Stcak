import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfile,
  orderController,
  AllorderController,
  updateOrderController,
} from "../controllers/authController.js";
import { isAdmin, requiredSignIn } from "../middleware/authMiddleware.js";

/*Router Object */
const router = express.Router();

/*Routing */

/*Register Route with Post method */
router.post("/register", registerController);

/*Login User with POst method */
router.post("/login", loginController);

/*Forgot Password  */
router.post("/forgotpassword", forgotPasswordController);

/*Test route */
router.get("/test", requiredSignIn, isAdmin, testController);

/* protected user route auth */
router.get("/userauth", requiredSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

/*protected route for Admin */
router.get("/adminauth", requiredSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

/*update profile */
router.put("/profile", requiredSignIn, updateProfile);

/*Orders */
router.get("/order", requiredSignIn, orderController);

/*Admin Orders */
router.get("/allorders", requiredSignIn, isAdmin, AllorderController);

/*Order status */
router.put(
  "/updateorders/:orderId",
  requiredSignIn,
  isAdmin,
  updateOrderController
);
export default router;
