import { Router } from "express";
import { addRant, getRants } from "../controllers/rants";

const router = Router();

router.get("/rants", getRants);
router.post("/rant", addRant);

export default router;
