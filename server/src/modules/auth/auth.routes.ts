import { Router } from "express";
import { registerHandler, loginHandler, getMeHandler } from "./auth.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/me", requireAuth, getMeHandler);

export default router;
