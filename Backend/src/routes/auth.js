import { Router } from "express";
import { register, login, getMe, updateProfile, logout, changePassword } from "../controllers/authController.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.put("/profile", authenticate, updateProfile);
router.post("/logout", authenticate, logout);
router.put("/password", authenticate, changePassword);

export default router;
