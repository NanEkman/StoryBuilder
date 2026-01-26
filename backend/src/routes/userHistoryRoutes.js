import { Router } from "express";
import { getUserHistory } from "../services/userHistoryService.js";
import verifyToken from "../middleware/verifyToken.js"; 
import {
  createUserHistory,
  getUserHistoryByUser,
  getMyUserHistory,
} from "../controllers/userHistoryController.js";

const router = Router();

router.use(verifyToken);

// POST /api/user-history  
router.post("/", createUserHistory);

// GET /api/user-history/me: hämtar historik för inloggad användare
router.get("/me", getMyUserHistory);

// GET /api/user-history/:user_id 
router.get("/:user_id", getUserHistoryByUser);

export default router;
