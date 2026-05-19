import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import optionalAuth from "../middleware/optionalAuth.js";
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
  toggleUpvote,
  getComments,
  addComment,
  deleteComment,
  getAllEvents,
  getAdminStats,
} from "../controllers/eventController.js";

const router = Router();

router.get("/", asyncHandler(listEvents));
router.get("/my", authenticate, asyncHandler(getMyEvents));
router.get("/saved", authenticate, asyncHandler(getSavedEvents));
router.get("/recommended", authenticate, asyncHandler(getRecommendedEvents));
router.get("/admin/stats", authenticate, authorize("admin"), asyncHandler(getAdminStats));
router.get("/all", authenticate, authorize("admin"), asyncHandler(getAllEvents));
router.get("/:id", optionalAuth, asyncHandler(getEvent));
router.post("/", authenticate, authorize("admin"), asyncHandler(createEvent));
router.put("/:id", authenticate, authorize("admin"), asyncHandler(updateEvent));
router.delete("/:id", authenticate, authorize("admin"), asyncHandler(deleteEvent));
router.post("/:id/register", authenticate, asyncHandler(registerForEvent));
router.delete("/:id/register", authenticate, asyncHandler(cancelRegistration));
router.post("/:id/bookmark", authenticate, asyncHandler(bookmarkEvent));
router.delete("/:id/bookmark", authenticate, asyncHandler(removeBookmark));
router.post("/:id/upvote", authenticate, asyncHandler(toggleUpvote));
router.get("/:id/comments", asyncHandler(getComments));
router.post("/:id/comments", authenticate, asyncHandler(addComment));
router.delete("/:id/comments/:commentId", authenticate, asyncHandler(deleteComment));

export default router;
