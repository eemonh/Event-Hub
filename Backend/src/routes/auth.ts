import { Router } from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  logout,
  changePassword,
} from "../controllers/authController.js";
import authenticate from "../middleware/authenticate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.get("/me", authenticate, asyncHandler(getMe));
router.put("/profile", authenticate, asyncHandler(updateProfile));
router.post("/logout", authenticate, asyncHandler(logout));
router.put("/password", authenticate, asyncHandler(changePassword));

export default router;
