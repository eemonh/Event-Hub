import { Router } from "express";
import { refreshAccess } from "../controllers/refreshController.js";

const router = Router();

router.post("/access", refreshAccess);

export default router;