import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { listUsers, listOrganizers, updateUserRole, deleteUser } from "../controllers/userController.js";

const router = Router();

router.get("/", authenticate, authorize("admin"), asyncHandler(listUsers));
router.get("/organizers", authenticate, authorize("admin"), asyncHandler(listOrganizers));
router.put("/:id/role", authenticate, authorize("admin"), asyncHandler(updateUserRole));
router.delete("/:id", authenticate, authorize("admin"), asyncHandler(deleteUser));

export default router;
