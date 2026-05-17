import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getSavedEvents,
  getRecommendedEvents,
  registerForEvent,
  cancelRegistration,
  bookmarkEvent,
  removeBookmark,
  getAllEvents,
} from "../controllers/eventController.js";

const router = Router();

router.get("/", asyncHandler(listEvents));
router.get("/my", authenticate, asyncHandler(getMyEvents));
router.get("/saved", authenticate, asyncHandler(getSavedEvents));
router.get("/recommended", authenticate, asyncHandler(getRecommendedEvents));
router.get("/all", authenticate, authorize("admin"), asyncHandler(getAllEvents));
router.get("/:id", asyncHandler(getEvent));
router.post("/", authenticate, authorize("admin"), asyncHandler(createEvent));
router.put("/:id", authenticate, authorize("admin"), asyncHandler(updateEvent));
router.delete("/:id", authenticate, authorize("admin"), asyncHandler(deleteEvent));
router.post("/:id/register", authenticate, asyncHandler(registerForEvent));
router.delete("/:id/register", authenticate, asyncHandler(cancelRegistration));
router.post("/:id/bookmark", authenticate, asyncHandler(bookmarkEvent));
router.delete("/:id/bookmark", authenticate, asyncHandler(removeBookmark));

export default router;
