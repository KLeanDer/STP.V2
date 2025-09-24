import express from "express";
import * as chatController from "./chat.controller.js";

const router = express.Router();

router.get("/:userId/:peerId", chatController.getConversation);
router.post("/", chatController.sendMessage);

export default router;
