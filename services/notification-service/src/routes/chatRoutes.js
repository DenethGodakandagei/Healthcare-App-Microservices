import express from "express";
import {
    accessChat,
    fetchChats,
    getChatById,
    createGroupChat,
    removeFromGroup,
    addToGroup,
    renameGroup,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Named routes MUST come before parameterized /:chatId
router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

// Parameterized route MUST be last
router.route("/:chatId").get(protect, getChatById);

export default router;