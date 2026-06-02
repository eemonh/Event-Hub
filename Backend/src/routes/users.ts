import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createUser,
  listUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();

router.post("/", authenticate, authorize("admin"), asyncHandler(createUser));
router.get("/", authenticate, authorize("admin"), asyncHandler(listUsers));
router.put("/:id/role", authenticate, authorize("admin"), asyncHandler(updateUserRole));
router.delete("/:id", authenticate, authorize("admin"), asyncHandler(deleteUser));

export default router;
