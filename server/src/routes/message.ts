import express from "express";
import {
  sendMessage,
  getConversations,
  getMessages,
  getUnreadCount,
} from "../controllers/messageController";
import { auth } from "../middleware/auth";

const router = express.Router();

// All message routes require authentication
router.use(auth);

// Message routes
router.post("/", sendMessage);
router.get("/conversations", getConversations);
router.get("/conversations/:userId", getMessages);
router.get("/unread", getUnreadCount);

export default router;
