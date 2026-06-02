import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getOverview,
  getRegistrationTrends,
  getCategoryBreakdown,
  getEventPerformance,
  getUserGrowth,
  getTopEvents,
} from "../controllers/analyticsController.js";

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/overview", asyncHandler(getOverview));
router.get("/registration-trends", asyncHandler(getRegistrationTrends));
router.get("/category-breakdown", asyncHandler(getCategoryBreakdown));
router.get("/event-performance", asyncHandler(getEventPerformance));
router.get("/user-growth", asyncHandler(getUserGrowth));
router.get("/top-events", asyncHandler(getTopEvents));

export default router;
