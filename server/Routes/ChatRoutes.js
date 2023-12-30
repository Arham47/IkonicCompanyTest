import express from "express";
import { createChat, createMessage, getAllMessages, getChats, getLatestChats,toggleMessageDelete } from "../Controllers/ChatController.js";
import { upload } from "../Middlewares/MulterMiddleware.js";
const router = express.Router();

router.post("/create", createChat);
router.get("/getchat", getChats);
router.get("/get-latest-chat", getLatestChats);
router.post('/messages', upload.fields([
    { name: "image", maxCount: 10 },]),createMessage);
router.post('/messages-chatid', getAllMessages);
router.put('/messages/:messageId/toggle-delete', toggleMessageDelete);



export default router;