import { Router } from "express";
import { refreshAccess } from "../controllers/refreshController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/access", asyncHandler(refreshAccess));

export default router;
