import { Router } from "express";
import { addRant, getRants } from "../controllers/rants";
import { readLimiter, writeLimiter } from "../utils/limiters";

const router = Router();

router.get("/rants", readLimiter, getRants);
router.post("/rant", writeLimiter, addRant);

export default router;
